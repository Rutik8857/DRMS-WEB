-- migration to normalize messages schema and enforce foreign key
-- deletes orphan messages and ensures proper columns/indexes

DELIMITER //
CREATE PROCEDURE ensure_messages_schema()
BEGIN
    -- rename old message column to content if necessary
    IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME='messages' AND COLUMN_NAME='message')
       AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                       WHERE TABLE_NAME='messages' AND COLUMN_NAME='content') THEN
        ALTER TABLE messages CHANGE COLUMN message content TEXT;
    END IF;

    -- add chat_id if missing
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME='messages' AND COLUMN_NAME='chat_id') THEN
        ALTER TABLE messages ADD COLUMN chat_id INT NOT NULL;
    END IF;

    -- add read_by_recipient if missing
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
                   WHERE TABLE_NAME='messages' AND COLUMN_NAME='read_by_recipient') THEN
        ALTER TABLE messages ADD COLUMN read_by_recipient TINYINT(1) NOT NULL DEFAULT 0;
    END IF;

    -- remove orphan rows before adding FK
    DELETE m FROM messages m LEFT JOIN chats c ON m.chat_id = c.id WHERE c.id IS NULL;

    -- add indexes if missing
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.STATISTICS
                   WHERE TABLE_NAME='messages' AND INDEX_NAME='idx_messages_chat_id') THEN
        ALTER TABLE messages ADD INDEX idx_messages_chat_id (chat_id);
    END IF;
    IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.STATISTICS
                   WHERE TABLE_NAME='messages' AND INDEX_NAME='idx_messages_read_by_recipient') THEN
        ALTER TABLE messages ADD INDEX idx_messages_read_by_recipient (read_by_recipient);
    END IF;

    -- foreign key
    IF NOT EXISTS (
        SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
        WHERE TABLE_NAME='messages' AND CONSTRAINT_TYPE='FOREIGN KEY'
          AND CONSTRAINT_NAME='fk_messages_chat_id'
    ) THEN
        ALTER TABLE messages
            ADD CONSTRAINT fk_messages_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE;
    END IF;
END;
//
DELIMITER ;

CALL ensure_messages_schema();
DROP PROCEDURE ensure_messages_schema();

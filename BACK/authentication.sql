CREATE TABLE authentication (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE members (
    member_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    provider VARCHAR(255),
    provider_id VARCHAR(255),
    created_date DATETIME(6),
    updated_date DATETIME(6),
    last_login DATETIME(6),
    profile_image_url VARCHAR(255),
    memorization_method ENUM('AssociationMethod', 'StorytellingMethod', 'VocabConnectMethod'),
    role ENUM('Admin','Student','Teacher'),
    PRIMARY KEY (member_id)
);

CREATE TABLE work_book (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255),
    script VARCHAR(255),
    difficulty INT,
    multiple_choice_amount INT,
    true_false_amount INT,
    short_answer_amount INT,
    is_public BOOLEAN,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    uuid VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES members(member_id)
);

CREATE TABLE problem (
    id BIGINT NOT NULL AUTO_INCREMENT,
    workbook_id BIGINT NOT NULL,
    question VARCHAR(255),
    choices VARCHAR(255),
    answer VARCHAR(255),
    question_type ENUM('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'),
    sequence_number INT,
    PRIMARY KEY (id),
    FOREIGN KEY (workbook_id) REFERENCES work_book(id)
);

CREATE TABLE Grading (
    id BIGINT NOT NULL AUTO_INCREMENT,
    quiz_set_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    score INT NOT NULL,
    submission_date DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES members(member_id),
    FOREIGN KEY (quiz_set_id) REFERENCES work_book(id)
);

CREATE TABLE QuizGrading (
    id BIGINT NOT NULL AUTO_INCREMENT,
    quiz_id BIGINT NOT NULL,
    submitted_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    feedback TEXT DEFAULT NULL,
    memorization TEXT DEFAULT NULL,
    grading_id BIGINT DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (quiz_id) REFERENCES problem(id),
    FOREIGN KEY (grading_id) REFERENCES Grading(id) ON DELETE SET NULL
);

CREATE TABLE Review (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    grading_id BIGINT DEFAULT NULL,
    quiz_set_id BIGINT NOT NULL,
    quiz_id BIGINT NOT NULL,
    to_review DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (grading_id) REFERENCES Grading(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES members(member_id),
    FOREIGN KEY (quiz_id) REFERENCES problem(id),
    FOREIGN KEY (quiz_set_id) REFERENCES work_book(id)
);

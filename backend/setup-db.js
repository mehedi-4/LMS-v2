const pool = require('./db');

async function setupDatabase() {
  try {
    const connection = await pool.getConnection();

    console.log('Setting up database tables...\n');

    // Create course table (matches existing schema if already present)
    console.log('Ensuring course table exists...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course (
        cid BIGINT AUTO_INCREMENT PRIMARY KEY,
        course_name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) DEFAULT 0.00,
        instructor_id BIGINT NOT NULL,
        FOREIGN KEY (instructor_id) REFERENCES instructor(tid)
      )
    `);

    // Create course_lecture table
    console.log('Creating course_lecture table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_lecture (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        course_id BIGINT NOT NULL,
        lecture_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        video_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES course(cid) ON DELETE CASCADE,
        UNIQUE KEY uq_course_lecture (course_id, lecture_number)
      )
    `);

    // Create course_material table
    console.log('Creating course_material table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_material (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        lecture_id BIGINT NOT NULL,
        material_type VARCHAR(100),
        file_path VARCHAR(500) NOT NULL,
        file_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lecture_id) REFERENCES course_lecture(id) ON DELETE CASCADE
      )
    `);

    // Optional: course_manifest table for JSON payloads
    console.log('Creating course_manifest table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS course_manifest (
        course_id BIGINT PRIMARY KEY,
        payload JSON NOT NULL,
        stored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES course(cid) ON DELETE CASCADE
      )
    `);

    // Create lecture_quiz table for quiz questions
    console.log('Creating lecture_quiz table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS lecture_quiz (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        lecture_id BIGINT NOT NULL,
        question TEXT NOT NULL,
        option_a VARCHAR(500) NOT NULL,
        option_b VARCHAR(500) NOT NULL,
        option_c VARCHAR(500) NOT NULL,
        option_d VARCHAR(500) NOT NULL,
        correct_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lecture_id) REFERENCES course_lecture(id) ON DELETE CASCADE
      )
    `);

    // Create student_quiz_attempt table to track quiz submissions
    console.log('Creating student_quiz_attempt table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS student_quiz_attempt (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        student_id BIGINT NOT NULL,
        lecture_id BIGINT NOT NULL,
        quiz_id BIGINT NOT NULL,
        selected_answer ENUM('A', 'B', 'C', 'D') NOT NULL,
        is_correct BOOLEAN NOT NULL,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES student(uid) ON DELETE CASCADE,
        FOREIGN KEY (lecture_id) REFERENCES course_lecture(id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES lecture_quiz(id) ON DELETE CASCADE
      )
    `);

    // Create student_course_score table to track overall course performance
    console.log('Creating student_course_score table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS student_course_score (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        student_id BIGINT NOT NULL,
        course_id BIGINT NOT NULL,
        total_quizzes INT NOT NULL DEFAULT 0,
        correct_answers INT NOT NULL DEFAULT 0,
        percentage_score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_student_course (student_id, course_id),
        FOREIGN KEY (student_id) REFERENCES student(uid) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES course(cid) ON DELETE CASCADE
      )
    `);

    // Create student_certificate table for earned certificates
    console.log('Creating student_certificate table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS student_certificate (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        student_id BIGINT NOT NULL,
        course_id BIGINT NOT NULL,
        validation_code VARCHAR(50) UNIQUE NOT NULL,
        percentage_score DECIMAL(5,2) NOT NULL,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_student_certificate (student_id, course_id),
        FOREIGN KEY (student_id) REFERENCES student(uid) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES course(cid) ON DELETE CASCADE
      )
    `);

    // Create student_lecture_progress table
    console.log('Creating student_lecture_progress table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS student_lecture_progress (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        student_id BIGINT NOT NULL,
        lecture_id BIGINT NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (student_id) REFERENCES student(uid) ON DELETE CASCADE,
        FOREIGN KEY (lecture_id) REFERENCES course_lecture(id) ON DELETE CASCADE,
        UNIQUE KEY uq_student_lecture (student_id, lecture_id)
      )
    `);

    // Add bank columns to instructor table if they don't exist
    console.log('Updating instructor table...');
    await connection.execute(`
      ALTER TABLE instructor 
      ADD COLUMN IF NOT EXISTS bank_acc_no VARCHAR(50),
      ADD COLUMN IF NOT EXISTS bank_secret_key VARCHAR(255)
    `);

    connection.release();

    console.log('\n✓ Database setup completed successfully!');
    console.log('\nTables created:');
    console.log('- course');
    console.log('- course_lecture');
    console.log('- course_material');
    console.log('- course_manifest');
    console.log('- lecture_quiz');
    console.log('- student_quiz_attempt');
    console.log('- student_course_score');
    console.log('- student_certificate');
    console.log('- student_lecture_progress');
    console.log('\nInstructor table updated with:');
    console.log('- bank_acc_no column');
    console.log('- bank_secret_key column');

    process.exit(0);
  } catch (error) {
    console.error('Database setup error:', error);
    process.exit(1);
  }
}

setupDatabase();

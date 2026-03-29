-- Departments
INSERT INTO departments (name, description, head_of_department, location, phone) VALUES 
('Cardiology', 'Heart related diseases', 'Dr. Smith Cardiac', '1st Floor', '111-222-3333'),
('Neurology', 'Brain and nerves', 'Dr. Allan Neuro', '2nd Floor', '111-222-4444'),
('Pediatrics', 'Children health', 'Dr. Sarah Kids', '3rd Floor', '111-222-5555');

-- Doctors
INSERT INTO doctors (first_name, last_name, specialization, phone, email, department, experience, available_days, created_at) VALUES 
('John', 'Doe', 'Cardiologist', '555-0101', 'john.doe@hospital.com', 'Cardiology', 10, 'Mon,Wed,Fri', NOW()),
('Jane', 'Smith', 'Neurologist', '555-0102', 'jane.smith@hospital.com', 'Neurology', 8, 'Tue,Thu', NOW()),
('Emily', 'Jones', 'Pediatrician', '555-0103', 'emily.jones@hospital.com', 'Pediatrics', 5, 'Mon,Tue,Wed,Thu,Fri', NOW()),
('Michael', 'Brown', 'Cardiac Surgeon', '555-0104', 'michael.brown@hospital.com', 'Cardiology', 15, 'Mon,Thu', NOW()),
('Sarah', 'Davis', 'Neurosurgeon', '555-0105', 'sarah.davis@hospital.com', 'Neurology', 12, 'Wed,Fri', NOW());

-- Patients
INSERT INTO patients (first_name, last_name, date_of_birth, gender, phone, email, address, blood_group, created_at) VALUES 
('Alice', 'Johnson', '1985-04-12', 'Female', '555-0201', 'alice.j@email.com', '123 Elm St', 'O+', NOW()),
('Bob', 'Williams', '1990-08-25', 'Male', '555-0202', 'bob.w@email.com', '456 Oak St', 'A-', NOW()),
('Charlie', 'Brown', '1978-11-03', 'Male', '555-0203', 'charlie.b@email.com', '789 Pine St', 'B+', NOW()),
('Diana', 'Evans', '2005-02-14', 'Female', '555-0204', 'diana.e@email.com', '321 Maple St', 'AB+', NOW()),
('Evan', 'Wright', '1965-07-30', 'Male', '555-0205', 'evan.w@email.com', '654 Birch St', 'O-', NOW()),
('Fiona', 'Clark', '1995-09-18', 'Female', '555-0206', 'fiona.c@email.com', '987 Cedar St', 'A+', NOW()),
('George', 'Lewis', '1982-12-05', 'Male', '555-0207', 'george.l@email.com', '159 Walnut St', 'B-', NOW()),
('Hannah', 'Walker', '2010-03-22', 'Female', '555-0208', 'hannah.w@email.com', '753 Ash St', 'O+', NOW()),
('Ian', 'Hall', '1970-06-11', 'Male', '555-0209', 'ian.h@email.com', '852 Cherry St', 'AB-', NOW()),
('Julia', 'Young', '1988-10-09', 'Female', '555-0210', 'julia.y@email.com', '951 Spruce St', 'A+', NOW());

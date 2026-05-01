require('dotenv').config();
const { sequelize, User, Project, Task, Team } = require('./models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Always ensure we have users - create if not exist
    let existingUsers = await User.findAll();
    
    if (existingUsers.length === 0) {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created');

      // Create member users
      const member1Password = await bcrypt.hash('member123', 10);
      const member1 = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: member1Password,
        role: 'member'
      });

      const member2Password = await bcrypt.hash('member123', 10);
      const member2 = await User.create({
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: member2Password,
        role: 'member'
      });
      console.log('✅ Member users created');
    } else {
      console.log('ℹ️  Users already exist, skipping user creation');
      console.log('📋 Existing users:');
      existingUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
      });
    }

    // Check if projects exist
    const existingProjects = await Project.findAll();
    if (existingProjects.length > 0) {
      console.log('ℹ️  Projects already exist, skipping project creation');
    } else {
      // Get admin user
      const admin = await User.findOne({ where: { role: 'admin' } });
      if (!admin) {
        console.log('❌ No admin user found, cannot create projects');
        return;
      }

      // Create projects
      const project1 = await Project.create({
        title: 'Website Redesign',
        description: 'Complete overhaul of company website',
        createdBy: admin.id
      });

const project2 = await Project.create({
        title: 'Mobile App Development',
        description: 'Native mobile app for iOS and Android',
        createdBy: admin.id
      });
      console.log('✅ Projects created');
      
      // Add users to projects (project-member associations)
      const allUsers = await User.findAll();
      
      // Add admin and members to project 1
      await project1.addUser(admin);
      if (allUsers[1]) await project1.addUser(allUsers[1]); // John
      if (allUsers[2]) await project1.addUser(allUsers[2]); // Jane
      
      // Add admin and members to project 2  
      await project2.addUser(admin);
      if (allUsers[1]) await project2.addUser(allUsers[1]); // John
      if (allUsers[2]) await project2.addUser(allUsers[2]); // Jane
      
      console.log('✅ Project members added');
    }

// Always create tasks - delete existing and recreate
    // First get fresh data
    const projects = await Project.findAll();
    const users = await User.findAll();
    
    // Delete all existing tasks and recreate
    await Task.destroy({ where: {}, truncate: true });
    console.log('🗑️  Cleared existing tasks');
    
if (projects.length > 0 && users.length > 0) {
      // Get admin user (first user with admin role)
      const adminUser = users.find(u => u.role === 'admin') || users[0];
      const user1 = users[1];
      const user2 = users[2];
      
      console.log(`📝 Creating tasks for admin: ${adminUser?.name}, user1: ${user1?.name}, user2: ${user2?.name}`);
      
      // ========== ADMIN TASKS (PROJECT 1) ==========
      await Task.create({
        title: 'Review project requirements',
        status: 'done',
        projectId: projects[0].id,
        assignedUserId: adminUser?.id
      });
      
      await Task.create({
        title: 'Approve homepage design',
        status: 'done',
        projectId: projects[0].id,
        assignedUserId: adminUser?.id
      });
      
      await Task.create({
        title: 'Client meeting preparation',
        status: 'in-progress',
        projectId: projects[0].id,
        assignedUserId: adminUser?.id
      });
      
      await Task.create({
        title: 'Final project sign-off',
        status: 'todo',
        projectId: projects[0].id,
        assignedUserId: adminUser?.id
      });
      
      // ========== JOHN TASKS (PROJECT 1) ==========
      await Task.create({
        title: 'Design homepage mockup',
        status: 'done',
        projectId: projects[0].id,
        assignedUserId: user1?.id
      });
      
      await Task.create({
        title: 'Implement navigation menu',
        status: 'in-progress',
        projectId: projects[0].id,
        assignedUserId: user1?.id
      });
      
      // ========== JANE TASKS (PROJECT 1) ==========
      await Task.create({
        title: 'Write about us page content',
        status: 'todo',
        projectId: projects[0].id,
        assignedUserId: user2?.id
      });
      
      // ========== ADMIN TASKS (PROJECT 2) ==========
      if (projects[1]) {
        await Task.create({
          title: 'Setup project repository',
          status: 'done',
          projectId: projects[1].id,
          assignedUserId: adminUser?.id
        });
        
        await Task.create({
          title: 'Review app wireframes',
          status: 'done',
          projectId: projects[1].id,
          assignedUserId: adminUser?.id
        });
        
        await Task.create({
          title: 'Budget approval',
          status: 'in-progress',
          projectId: projects[1].id,
          assignedUserId: adminUser?.id
        });
        
        await Task.create({
          title: 'Final project sign-off',
          status: 'todo',
          projectId: projects[1].id,
          assignedUserId: adminUser?.id
        });
        
        // ========== JOHN TASKS (PROJECT 2) ==========
        await Task.create({
          title: 'Setup React Native project',
          status: 'done',
          projectId: projects[1].id,
          assignedUserId: user1?.id
        });
        
        // ========== JANE TASKS (PROJECT 2) ==========
        await Task.create({
          title: 'Implement login screen',
          status: 'in-progress',
          projectId: projects[1].id,
          assignedUserId: user2?.id
        });
      }
      
      console.log('✅ Tasks created with assigned users');
    } else {
      console.log('⚠️  No projects or users found, cannot create tasks');
    }

    console.log('\n🎉 Database check completed!');
    console.log('\n📋 Available login credentials (from existing users):');
    existingUsers.forEach(user => {
      console.log(`   - ${user.name}: ${user.email}`);
    });
    console.log('\n💡 Passwords are likely: admin123, member123, or check your signup history');

    console.log('\n🎉 Database seeding completed!');
    console.log('\n📋 Available login credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Member: john@example.com / member123');
    console.log('Member: jane@example.com / member123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seed function
seedDatabase();
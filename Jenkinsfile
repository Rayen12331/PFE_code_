pipeline {
    agent any
    stages {
        stage('import Project') {
            steps {
                // Checkout MERN project code from version control
                git branch: 'master', url: 'https://github.com/Rayen12331/PFE_code_.git
                
            }
        }
        
        stage('Build') {
            steps {
                // Install dependencies and build the React app
                sh 'cd client && npm install'
                sh 'cd client && npm run build'

                // Install dependencies and build the Node.js server
                sh 'cd server && npm install'
                sh 'cd server && npm install -g nodemon'
            }
        }
        
        
        stage('Deploy') {
            steps {
                sshagent(credentials: ['rayen']) {
                    sh 'scp -r C:\\Users\\LENOVO\\.jenkins\\workspace\\Deployment tool Pipeline rayen@127.0.0.1:/var/lib/jenkins/workspace/' // Copy the MERN project files to the VM
                    sh 'ssh -o StrictHostKeyChecking=no rayen@127.0.0.1 "cd /var/lib/jenkins/workspace/ && npm install"' // Install dependencies for the MERN project on the VM
                    sh 'ssh -o StrictHostKeyChecking=no rayen@127.0.0.1 "sudo systemctl start your-service"' // Start the service on the VM
                }
            }
        }
    }
}

module.exports = {
	  apps: [
		      {
			            name: 'rhp',
			            script: 'npm',
			            args: 'start',
			            env: {
					            NODE_ENV: 'production',
					          },
			            cwd: '/home/ubuntu/apps/rhp-data',
			          },
		    ],
};


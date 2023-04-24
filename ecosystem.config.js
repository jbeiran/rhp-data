module.exports = {
	  apps: [
		      {
			            name: 'rhp',
			            script: 'server.js',
			            args: 'start',
			            env: {
					            NODE_ENV: 'production',
					          },
			            cwd: '/home/ubuntu/apps/rhp-data',
			          },
		    ],
};


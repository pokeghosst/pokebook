export default defineNitroConfig({
	runtimeConfig: {
		redis: {
			host: '',
			port: 0,
			password: ''
		},
		google: {
			clientId: '',
			clientSecret: ''
		},
		dropbox: {
			appKey: '',
			appSecret: ''
		},
		pokebookFolderName: '',
		serverUrl: '',
		clientUrl: ''
	},
	routeRules: {
		'/**': {
			cors: true,
			headers: {
				// TODO: For the love of all that is holy, DON'T FORGET TO ADD PRODUCTION HOST
				'Access-Control-Allow-Origin': 'http://localhost:5173',
				'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization',
				'Access-Control-Allow-Credentials': 'true',
				'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, DELETE'
			}
		}
	},
	compatibilityDate: '2025-03-02'
});

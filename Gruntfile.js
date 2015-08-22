module.exports = function(grunt){

grunt.initConfig({
	watch: {
		files: "./*js",
		options: {
			livereload: true
		}
	},
	connect: {
		server: {	
			options: {
				hostname: "localhost",
				port: 9000
			}
		}
	}

});

grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-connect');

grunt.registerTask('default', ['connect', 'watch']);
};

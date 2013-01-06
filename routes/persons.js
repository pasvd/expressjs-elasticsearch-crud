ElasticSearchClient = require('elasticsearchclient');

var serverOptions = {
    host: 'localhost',
    port: 9200,
};
var elasticSearchClient = new ElasticSearchClient(serverOptions);

var qryObj = {
	"query" : {
		"match_all" : { }
	}
}

/*
 * GET persons listing.
 */
exports.list = function(req, res){
	elasticSearchClient.search('addressbook', 'person', qryObj)
	    .on('data', function(data) {
	        console.log(JSON.parse(data));
	        res.render('list.jade', {persons : JSON.parse(data).hits.hits });
	        })
	    .on('done', function(){
	        	//always returns 0 right now
	       	})
	    .on('error', function(error){
	        	console.log(error)
	        	res.render('list.jade', {persons: []});
	        })
	        .exec()
};

/*
 * GET new person form.
 */
exports.new = function(req, res){
  res.render('new.jade', {});
};

/*
 * POST new person.
 */
exports.create = function(req, res){
	elasticSearchClient.index('addressbook', 'person', req.body)
	  	.on('data', function(data) {
	    	console.log(data);
	    	res.redirect("/persons/show/" + JSON.parse(data)._id);
	  	 }).exec()
};

/*
 * GET edit person form.
 */
exports.edit = function(req, res){
	elasticSearchClient.get('addressbook', 'person', req.params.id)
        .on('data', function(data) {
        	console.log(data);
        	res.render('edit.jade', {person: JSON.parse(data)})})
         .exec()
};

/*
 * PUT update person.
 */
exports.update = function(req, res){
	elasticSearchClient.index('addressbook', 'person', req.body)
	  	.on('data', function(data) {
	    	console.log(data);
	    	res.redirect("/persons/show/" + JSON.parse(data)._id);
	  	 }).exec()
};

exports.show = function (req, res) {
	elasticSearchClient.get('addressbook', 'person', req.params.id)
        .on('data', function(data) {
        	console.log(data);
        	res.render('show.jade', {person: JSON.parse(data)})})
         .exec()
};
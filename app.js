var bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    express        = require("express"),
    app            = express(),
    methodOverride = require("method-override");

    // App Config
    mongoose.connect("mongodb://localhost/blog_app");
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));

    // title, image, body, created_date
    // Model for blog App
    var blogSchema = new mongoose.Schema({
        title : String,
        image : String,
        body : String,
        created: {type: Date, default: Date.now}
    });

    var blog = mongoose.model("blog", blogSchema);

    // blog.create({

    //     title:"CoronaVirus",
    //     image:"Nahi he",
    //     body:"Bahut Khatarnak he"
        
    // });
    // Restful Routes

    app.get("/", function(req, res){
        res.redirect("/blogs");
    });

    app.get("/blogs", function(req, res){
        blog.find({}, function(err, allBlogs){
            if(err){
                console.log("Found Error while listing all Blogs");
            }
            else{
                res.render("index", {blogs : allBlogs});
            }
        });
    });

    // Create New Blog
    app.get("/blogs/new", function(req, res){
        res.render("new");
    });

    // create route
    app.post("/blogs", function(req, res){
        // console.log(req.body.blog.body);
        req.body.blog.body = req.sanitize(req.body.blog.body);
        // console.log(req.body.blog.body);
        blog.create(req.body.blog, function(err, newBlog){
            if(err){
                console.log("Error while creating new Blog");
            }
            else{
                res.redirect("/blogs");
            }
        });
    });

    // show route

    app.get("/blogs/:id", function(req, res){
    
        // var foundBlog = mongoose.Types.ObjectId(req.params.id);
        // res.render("show", {blog : foundBlog});
        // var myId = JSON.parse(req.body.id);
        // var myId = JSON.parse(req.params.id);
        // myId.trim();
        blog.findById(req.params.id.trim(), function(err, foundBlog){

            if(err){
                console.log(err);
            }
            else{
                res.render("show", {blog:foundBlog});
            }
        });
    });


    // Edit Route

    app.get("/blogs/:id/edit", function(req, res){
        blog.findById(req.params.id.trim(), function(err, foundBlog){
            if(err){
                console.log(err);
            }   
            else{
                res.render("edit", { blog : foundBlog });
            }
        });
    });

    // updated route

    app.post("/blogs/:id", function(req, res){

        req.body.blog.body = req.sanitize(req.body.blog.body);

        blog.findByIdAndUpdate(req.params.id.trim(), req.body.blog, function(err, updatedBlog){
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/blogs/" + req.params.id.trim());
            }
        });
    
    });

    // delete Route

    app.delete("/blogs/:id", function(req,res){
        blog.findByIdAndRemove(req.params.id.trim(), function(err){
            if(err){
                console.log(err);
            }
            else{
                res.redirect("/blogs");
            }
        });
    });
    app.listen(3000, function(){
        console.log("app is running at 3000");
    });
var bodyparser=require('body-parser'),
mongoose=require('mongoose'),
express=require('express'),
expresssanitizer=require('express-sanitizer'),
methodoverride=require('method-override'),
app=express();


// App configuration
mongoose.connect('mongodb://localhost/restful_blog_app');
app.set('view engine',"ejs");
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expresssanitizer());
app.use(methodoverride('_method'));


// Mongoose Model Configuration
var blogschema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogschema);


// Restful Routes
app.get("/",function(req,res)
{
    res.redirect("/blogs");
})


// INDEX ROUTE
app.get("/blogs",function(req,res)
{
    //res.send("gotcha");
    Blog.find({},function(err,blogs)
    {
        if(err)
           console.log("error occured");
        else 
           res.render('index',{blogs:blogs});
    })
})

// NEW ROUTE
app.get("/blogs/new",function(req,res)
{
    res.render('new');
})


//BLOG POST ROUTE
app.post("/blogs",function(req,res)
{
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,blog)
    {
        if(err)
          console.log("error occured");
        else 
        {
           console.log("blog_added");
           res.redirect('/blogs');
        }
    })
})

// show page now
app.get("/blogs/:id",function(req,res)
{
    Blog.findById(req.params.id,function(err,blog)
    {
        if(err)
          res.redirect('/blogs');
        else 
          res.render("show",{blog:blog});
    })
})

// udate the blog now
app.get("/blogs/:id/edit",function(req,res)
{
    Blog.findById(req.params.id,function(err,blog)
    {
        if(err)
          res.redirect("/blogs");
        else 
          res.render('edit',{blog:blog})
    })
})

app.put("/blogs/:id",function(req,res)
{
   req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog)
    {
        if(err)
          res.redirect('/blogs');
        else 
        {
          res.redirect('/blogs/'+req.params.id);
          console.log(req.params.blog);
        }
    })
})

app.delete("/blogs/:id",function(req,res)
{
  Blog.findByIdAndRemove(req.params.id,function(err)
  {
    if(err)
       res.redirect("/blogs");
    else 
       res.redirect("/blogs");
  })
})





app.listen(3000);
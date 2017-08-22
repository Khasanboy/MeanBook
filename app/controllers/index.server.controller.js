exports.render = function(req, res){
    //res.status(200).send('Hello world');
    /*
    if(req.session.lastVisit){
        console.log(req.session.lastVisit);
    }

    req.session.lastVisit = new Date();

    res.render('index', {
        title:'Hello world'
    });
    */

    res.render('index', {
        title:'Hello world',
        userFullName:req.user? req.user.fullName:''
    });
};
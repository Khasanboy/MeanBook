module.exports= {
    //Development configurations
    db: 'mongodb://localhost/mean-book',
    sessionSecret:'developmentSessionSecret',
    facebook:{
        clientID:'347601425698139',
        clientSecret:'51926d502cad3f7fbb2830b4f2e21594',
        callbackURL:'http://localhost:3000/oauth/facebook/callback'
    }
}
module.exports = {
    routes: [
        { // Path defined with a URL parameter
            method: 'GET',
            path: '/count',
            handler: 'order.count',
            config:{
              auth:  false
            }
        },
    ]
}

module.exports = {
    "plugins": [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-dynamic-import", ["component", {
            "libraryName": "mint-ui",
            "style": true
        }]
    ]
}
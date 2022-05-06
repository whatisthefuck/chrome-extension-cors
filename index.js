
const URLS = 'urls'
document.getElementById('addRule').addEventListener('click', (e) => {
    chrome.storage.sync.set({URLS: [1,2,3]}, function() {
        console.log('Value is set to ' + URLS);
        renderList()
    });
    return
    console.log(e)
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [14],
        addRules: [{
            "id": 14,
            "priority": 2,
            "action": {
                "type": "modifyHeaders",
                "responseHeaders": [
                    { "header": "Access-Control-Allow-Origin", "operation": "set", "value": "*" },
                    { "header": "bb", "operation": "set", "value": "*1" }
                ]
            },
            "condition": {
                "urlFilter": "*",
                "resourceTypes": ["image", "main_frame", "stylesheet", "script", "other", "xmlhttprequest"]
            }
        }]
    }, function (res) {
        console.log(res)
    })
})

console.log('document', document)

function renderList () {
    chrome.storage.sync.get([URLS], function(result) {
        console.log('Value currently is ' + result.key);
        // document.getElementById('addRule').innerHTML =
    });
}
window.onload = () => {
    console.log('vue', Vue)
    // new Vue({
    //     el: '#app',
    //     data() {
    //         return {
    //             list: [1, 2, 3]
    //         }
    //     }
    // })
}

// blockUrls.forEach((domain, index) => {
//     let id = index + 1;
//
//     chrome.declarativeNetRequest.updateDynamicRules(
//         {addRules:[{
//                 "id": id,
//                 "priority": 1,
//                 "action": { "type": "block" },
//                 "condition": {"urlFilter": domain, "resourceTypes": ["main_frame"] }}
//             ],
//             removeRuleIds: [id]
//         },
//     )
// })
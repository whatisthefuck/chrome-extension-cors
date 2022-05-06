
// const urls = [
//     {
//         url: 'https://ss.cc',
//         enable: true
//     }
// ]

const URLS = 'urls'
const app = document.getElementById('app')
const addRule = document.getElementById('addRule')
const addUrlForm = document.getElementById('addUrlForm')
const saveBtn = document.getElementById('saveBtn')
const addBlockUrlInput = document.getElementById('addBlockUrlInput')
addRule.addEventListener('click', (e) => {
    addUrlForm.style.display = 'block'
    // chrome.declarativeNetRequest.updateDynamicRules({
    //     removeRuleIds: [14],
    //     addRules: [{
    //         "id": 14,
    //         "priority": 2,
    //         "action": {
    //             "type": "modifyHeaders",
    //             "responseHeaders": [
    //                 { "header": "Access-Control-Allow-Origin", "operation": "set", "value": "*" },
    //                 { "header": "bb", "operation": "set", "value": "*1" }
    //             ]
    //         },
    //         "condition": {
    //             "urlFilter": "*",
    //             "resourceTypes": ["image", "main_frame", "stylesheet", "script", "other", "xmlhttprequest"]
    //         }
    //     }]
    // }, function (res) {
    //     console.log(res)
    // })
})

saveBtn.addEventListener('click', function handleSave() {
    console.log('addBlockUrlInput', addBlockUrlInput.value)
    chrome.storage.local.get(URLS, function(result) {
        const urls = result[URLS] || []
        chrome.storage.local.set({[URLS]: [...urls, { url: addBlockUrlInput.value, enable: true}]}, function() {
            renderList()
        });
    });
    addUrlForm.style.display = 'none'
})

app.addEventListener('click', function (e) {
    const targetElementId = e.target.id
    console.log('click', targetElementId)
    if (targetElementId?.indexOf("checkbox") !== -1) {
        const checkboxIndex = Number(targetElementId.split('-').pop())
        chrome.storage.local.get(URLS, function(result) {
            const urls = result[URLS]
            console.log(JSON.stringify(urls), JSON.stringify(urls.map((urlInfo, index) => index === checkboxIndex ? {...urlInfo, enable: !urls[index].enable} : urlInfo)))
            chrome.storage.local.set({[URLS]: urls.map((urlInfo, index) => index === checkboxIndex ? {...urlInfo, enable: !urls[index].enable} : urlInfo)}, function() {
                renderList()
            });
        });
    }
})

function renderList () {
    chrome.storage.local.get(URLS, function(result) {
        console.log('Value currently is ', result[URLS]);
        const urls = result[URLS]
        let str = ''
        urls?.forEach((urlInfo, index) => {
            str += `<div style="display: flex">
                       <input type=checkbox ${urlInfo.enable && 'checked'} id=checkbox-${index} />
                       <div>${urlInfo.url}</div>
                    </div>`
        })
        app.innerHTML = str
    });
}
window.onload = () => {
    renderList()
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
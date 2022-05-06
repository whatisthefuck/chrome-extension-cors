// const urls = [
//     {
//         url: 'https://ss.cc',
//         enable: true
//     }
// ]

function genRule(urlInfo, id) {
    const { url } = urlInfo
    return {
        "id": id,
        "priority": 2,
        "action": {
            "type": "modifyHeaders",
            "responseHeaders": [
                {"header": "Access-Control-Allow-Origin", "operation": "set", "value": "*"},
            ]
        },
        "condition": {
            "urlFilter": url,
            "resourceTypes": ["image", "main_frame", "stylesheet", "script", "other", "xmlhttprequest"]
        }
    }
}

const URLS = 'urls'
const app = document.getElementById('app')
const addRule = document.getElementById('addRule')
const addUrlForm = document.getElementById('addUrlForm')
const saveBtn = document.getElementById('saveBtn')
const addBlockUrlInput = document.getElementById('addBlockUrlInput')
addRule.addEventListener('click', (e) => {
    addUrlForm.style.display = 'block'
})

saveBtn.addEventListener('click', function handleSave() {
    console.log('addBlockUrlInput', addBlockUrlInput.value)
    chrome.storage.local.get(URLS, function (result) {
        const urls = result[URLS] || []
        const newUrls = [...urls, {url: addBlockUrlInput.value, enable: true}]
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: Array(urls.length).fill(0).map((_,i) => i + 1),
            addRules: newUrls.filter(urlInfo => urlInfo.enable).map((item, index) => genRule(item, index + 1))
        })
        chrome.storage.local.set({[URLS]: newUrls}, function () {
            renderList()
        });
    });
    addUrlForm.style.display = 'none'
})

app.addEventListener('click', function handleAppClick(e) {
    const targetElementId = e.target.id
    console.log('click', targetElementId)
    if (targetElementId?.indexOf("checkbox") !== -1) {
        const checkboxIndex = Number(targetElementId.split('-').pop())
        chrome.storage.local.get(URLS, function (result) {
            const urls = result[URLS]
            const newUrls = urls.map((urlInfo, index) => index === checkboxIndex ? {
                ...urlInfo,
                enable: !urls[index].enable
            } : urlInfo)
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: Array(urls.length).fill(0).map((_,i) => i + 1),
                addRules: newUrls.filter(urlInfo => urlInfo.enable).map((item, index) => genRule(item, index + 1))
            })
            chrome.storage.local.set({
                [URLS]: newUrls
            }, function () {
                renderList()
            });
        });
    }
})

function renderList() {
    chrome.storage.local.get(URLS, function (result) {
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
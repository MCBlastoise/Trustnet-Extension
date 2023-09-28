import Vue from 'vue';
import store from '@/store';
import insertedApp from '@/App';
import router from '@/router';
import '@/validation'
import vuetify from '@/plugins/vuetify';
// let prevIframe = document.querySelector('iframe[data-sth="customPopupIframe"]');
// let iframe;
// // if (prevIframe === null) {
//     iframe = document.createElement('iframe');
//     iframe.classList.add('extension-side-bar');
//     iframe.setAttribute('src', chrome.extension.getURL("popup.html"));
//     iframe.setAttribute('data-sth', 'customPopupIframe')
//     document.body.appendChild(iframe);
// // }

browser.runtime.sendMessage({
    type: 'get_user'
})
.then(authUser => {

    console.log('auth user is', authUser)
    if (authUser)
        localStorage.setItem('trustnetAuthToken', JSON.stringify(authUser));

    const container = document.createElement('div');
    container.setAttribute('data-vuetify-trustnet', '')
    const app = document.createElement('div');
    app.setAttribute('id', 'trustnetApp');
    container.appendChild(app);
    document.body.prepend(container);
    
    /* eslint-disable no-new */
    new Vue({
        el: '#trustnetApp',
        store,
        router,
        vuetify,
        render: h => h(insertedApp),
    });
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'toggle') {
        // console.log(store.state.assessments.assessments);
        
        const assessmentsVisible = store.state.assessments.isExpanded;
        const assessmentsOpen = store.state.assessments.keepAssessmentsOpen;

        if (!assessmentsVisible) {
            store.dispatch('assessments/setKeepAssessmentsOpen', true)
            .then(() => {
                store.dispatch('assessments/setVisibility', true);
            });
        }
        else if (assessmentsOpen) {
            store.dispatch('assessments/setVisibility', false);
        }

        return true;
    }
    else if (request.type === 'change_icon') {
        if (!document.hidden) {
            store.dispatch('assessments/changeIcon');
            return true;
        }
    }
});


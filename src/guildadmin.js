import { socket } from './index';
var token;
document.addEventListener('DOMContentLoaded', function (e) {
    var basicFormSubmit = document.getElementById('basic-submit');
    var basicForm = document.getElementById('basic-form');
    basicFormSubmit.addEventListener('click', function (e) {
        for (let element of basicForm.children[0].children) {
            if (element.getAttribute('type') == 'text') {
                socket.emit('settingsChange', { key: element.id, value: element.value, guild_id: location.href.substring(location.href.lastIndexOf('/') + 1), token: token });
            }
        };
    });

    var embedFormSubmit = document.getElementById('embed-submit');
    var embedForm = document.getElementById('embed-form');
    embedFormSubmit.addEventListener('click', function (e) {

        var embedData = {};
        for (let element of embedForm.children[0].children) {
            console.log(element.type);
            if (element.getAttribute('type') == 'text') {
                embedData[element.id] = element.value;
            } else if (element.type == "select-one") {
                console.log(element.selectedOptions[0].id);
                embedData[element.id] = element.selectedOptions[0].id;
            } else if (element.type == "color") {
                embedData[element.id] = element.value;
            }
        }
        embedData['message-text'] = document.getElementById('message-text').innerHTML;
        embedData['guildID'] = location.href.substring(location.href.lastIndexOf('/') + 1)

        var thumbnail = document.getElementById('message-thumbnail');
        var image = document.getElementById('message-image');
        var authorIcon = document.getElementById("message-author-icon");

        var formData = new FormData();
        formData.append('data', JSON.stringify(embedData));
        if (thumbnail.files.length == 1) {
            formData.append('thumbnail', thumbnail.files[0]);
        }
        if (image.files.length == 1) {
            formData.append('image', image.files[0]);
        }
        if (authorIcon.files.length == 1) {
            formData.append('authorIcon', authorIcon.files[0]);
        }
        fetch('/api/dashboard/embed', { method: "POST", body: formData });
        console.log(embedData);

    });
    var saveSettingsBtn = document.getElementById('saveSettingsBtn');
    saveSettingsBtn.addEventListener('click', e => {
        var checkboxes = document.getElementsByClassName('checkbox-command');
        var enabled = [];
        var disabled = [];
        Array.from(checkboxes).forEach(checkbox => {
            if (checkbox.checked) {
                enabled.push(checkbox.id);
            } else {
                disabled.push(checkbox.id);
            }

        });
        console.log(enabled);
        console.log(disabled);
        socket.emit('updateGuildCommands', { guild_id: location.href.substring(location.href.lastIndexOf('/') + 1), enabled: enabled, disabled: disabled, token: token })
    });
    var rawServerBtn = document.getElementById('rawServerBtn');
    rawServerBtn.addEventListener('click', e => {
        socket.emit('rawServer', { token: token, id: location.href.substring(location.href.lastIndexOf('/') + 1) });
    });

    socket.on('sendGuildDisabledCommands', data => {
        if (data != null) {
            data.disabledCommands.forEach(element => {
                var checkbox = document.getElementById(element);
                checkbox.removeAttribute('checked')
            });
        };
    });

});

function getAllCommands() {
    socket.emit('getAllCommands');
}

socket.on('allCommands', function (data) {
    console.log(data);
});

socket.on('getToken', function (data) {
    let tokenFetch = fetch(`/api/user/socketiotoken?sid=${socket.id}`, { method: "GET" })
        .then(
            function (response) {
                response.json().then(function (data) {
                    console.log(data);
                    token = data;
                    socket.emit('token', data);
                    socket.emit('getGuildDisabledCommands', { token: token, guild_id: location.href.substring(location.href.lastIndexOf('/') + 1) });
                });
            }
        );
});

socket.on('rawServerData', data => {
    let url = URL.createObjectURL(new Blob([JSON.stringify(data['rawData'])], { type: 'application/json' }));
    let a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", location.href.substring(location.href.lastIndexOf('/') + 1));
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
});

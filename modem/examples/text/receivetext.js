var TextReceiver = (function() {
    Quiet.init({
        profilesPrefix: "/modem/",
        memoryInitializerPrefix: "/modem/",
        libfecPrefix: "/modem/"
    });
    var profile;
    var btn, clearbtn, copybtn;
    var target;
    var content;
    var warningbox;

    function onReceive(recvPayload) {
        content = Quiet.mergeab(content, recvPayload);
        target.value = Quiet.ab2str(content);
        warningbox.classList.add("hidden");
    };

    function onReceiverCreateFail(reason) {
        console.log("failed to create quiet receiver: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Sorry, it looks like this example is not supported by your browser. Please give permission to use the microphone or try again in Google Chrome or Microsoft Edge."
    };

    function onReceiveFail(num_fails) {
        warningbox.classList.remove("hidden");
        warningbox.textContent = "We didn't quite get that. It looks like you tried to transmit something. You may need to move the transmitter closer to the receiver and set the volume to 50%."
    };

    function onQuietReady() {
        for (var name in Quiet.getProfiles()) {
            profile.add(new Option(name, name));
        }
        btn.addEventListener('click', onClick, false);
        clearbtn.addEventListener('click', onClear, false);
        copybtn.addEventListener('click', onCopy, false);
    };

    function onClick(e) {
        e.target.disabled = true;
        e.target.innerText = e.target.getAttribute('data-quiet-recving-text');
        onClear(e);
        Quiet.receiver({profile: profile.value,
             onReceive: onReceive,
             onCreateFail: onReceiverCreateFail,
             onReceiveFail: onReceiveFail
        });
    }

    function onClear(e) {
        target.value = "Your received text will show up here. Waiting...";
        content = new ArrayBuffer(0);
    }

    function onCopy(e) {
        navigator.clipboard.writeText(target.value);
    }

    function onQuietFail(reason) {
        console.log("quiet failed to initialize: " + reason);
        warningbox.classList.remove("hidden");
        warningbox.textContent = "Sorry, it looks like there was a problem with this example (" + reason + ")";
    };

    function onDOMLoad() {
        profile = document.getElementById('profile');
        btn = document.querySelector('[data-quiet-recv-button]');
        clearbtn = document.querySelector('[data-quiet-clear-button]');
        copybtn = document.querySelector('[data-quiet-copy-button]');
        target = document.querySelector('[data-quiet-receive-text-target]');
        warningbox = document.querySelector('[data-quiet-warning]');
        Quiet.addReadyCallback(onQuietReady, onQuietFail);
    };

    document.addEventListener("DOMContentLoaded", onDOMLoad);
})();

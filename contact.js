
/* Inizializzazione EmailJS */
emailjs.init({
    publicKey: "-3GoEEo21PnNe78NV"
});

/* Selezione degli elementi */
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitButton = contactForm.querySelector(".contact-submit");
const successPopup = document.getElementById("success-popup");

/* Invio del form */
contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    formStatus.textContent = "";

    try {
        await emailjs.sendForm(
            "service_9n5tr4o",
            "template_d7l92xo",
            contactForm
        );

        /* Rimuove eventuali messaggi precedenti */
        formStatus.textContent = "";

        /* Mostra il popup di successo */
        successPopup.classList.add("show");

        /* Nasconde il popup dopo 3 secondi */
        setTimeout(() => {
            successPopup.classList.remove("show");
        }, 3000);

        /* Svuota il form */
        contactForm.reset();

    } catch (error) {
        console.error("EmailJS error:", error);

        formStatus.textContent =
            "Sorry, your message could not be sent. Please try again.";

    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Share your idea";
    }
});

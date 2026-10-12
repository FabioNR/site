const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const year = document.getElementById("ano");
const form = document.getElementById("form-contato");
const statusEl = document.getElementById("form-status");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu");
    });
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nome = String(data.get("nome") || "").trim();
    const contato = String(data.get("contato") || "").trim();
    const servico = String(data.get("servico") || "").trim();
    const mensagem = String(data.get("mensagem") || "").trim();

    if (!nome || !contato || !mensagem) {
      statusEl.textContent = "Preencha nome, contato e mensagem.";
      return;
    }

    const texto = [
      "Olá, NydzaTech Solutions.",
      `Meu nome é ${nome}.`,
      `Contato: ${contato}.`,
      `Interesse: ${servico}.`,
      "",
      mensagem,
    ].join("\n");

    const url = `https://wa.me/5541988059554?text=${encodeURIComponent(texto)}`;
    statusEl.textContent = "Abrindo o WhatsApp…";
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

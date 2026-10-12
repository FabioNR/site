const SESSION_KEY = "nydzatech.cliente";

const CONTA = {
  email: "cliente@nydzatech.me",
  senha: "Nydza2026",
  nome: "Ana Costa",
  empresa: "Aurora Alimentos Ltda.",
  documento: "00.000.000/0001-91",
  planos: [
    {
      id: "pln-site",
      nome: "Manutenção de site institucional",
      ciclo: "Mensal",
      valor: 490,
      status: "ativo",
      renovacao: "2026-11-12",
      descricao: "Atualizações, suporte técnico e monitoramento do site.",
    },
    {
      id: "pln-auto",
      nome: "Automação de rotinas de TI",
      ciclo: "Anual",
      valor: 3480,
      status: "ativo",
      renovacao: "2027-03-04",
      descricao: "Fluxos automatizados, backups e rotinas operacionais.",
    },
    {
      id: "pln-host",
      nome: "Hospedagem e monitoramento",
      ciclo: "Mensal",
      valor: 180,
      status: "ativo",
      renovacao: "2026-11-12",
      descricao: "Infraestrutura, SSL, uptime e alertas.",
    },
  ],
  contratos: [
    {
      id: "cps-2026-014",
      titulo: "Contrato de prestação de serviços",
      numero: "CPS-2026-014",
      status: "vigente",
      inicio: "2026-03-01",
      fim: "2027-02-28",
      objeto:
        "Desenvolvimento, manutenção de site institucional, hospedagem e suporte técnico contínuo.",
    },
    {
      id: "adt-2026-003",
      titulo: "Aditivo de automação",
      numero: "ADT-2026-003",
      status: "vigente",
      inicio: "2026-03-04",
      fim: "2027-03-03",
      objeto: "Implantação e operação de rotinas de automação em informática.",
    },
    {
      id: "cps-2025-008",
      titulo: "Contrato de web design",
      numero: "CPS-2025-008",
      status: "encerrado",
      inicio: "2025-02-10",
      fim: "2026-02-09",
      objeto: "Projeto visual e entrega da primeira versão do site institucional.",
    },
  ],
  faturas: [
    {
      id: "fat-2026-010",
      numero: "FAT-2026-010",
      competencia: "Outubro/2026",
      vencimento: "2026-10-15",
      valor: 670,
      status: "pendente",
      itens: ["Manutenção de site institucional", "Hospedagem e monitoramento"],
    },
    {
      id: "fat-2026-009",
      numero: "FAT-2026-009",
      competencia: "Setembro/2026",
      vencimento: "2026-09-15",
      valor: 670,
      status: "pago",
      itens: ["Manutenção de site institucional", "Hospedagem e monitoramento"],
    },
    {
      id: "fat-2026-008",
      numero: "FAT-2026-008",
      competencia: "Agosto/2026",
      vencimento: "2026-08-15",
      valor: 670,
      status: "pago",
      itens: ["Manutenção de site institucional", "Hospedagem e monitoramento"],
    },
    {
      id: "fat-2026-003",
      numero: "FAT-2026-003",
      competencia: "Março/2026",
      vencimento: "2026-03-10",
      valor: 3480,
      status: "pago",
      itens: ["Automação de rotinas de TI (anual)"],
    },
  ],
};

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dataBR = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");

const getSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

const setSession = (payload) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
};

const clearSession = () => sessionStorage.removeItem(SESSION_KEY);

const badgeClass = (status) => {
  if (status === "ativo" || status === "vigente" || status === "pago") return "badge badge-ok";
  if (status === "pendente") return "badge badge-warn";
  return "badge badge-muted";
};

const initLogin = () => {
  if (getSession()) {
    window.location.replace("./painel.html");
    return;
  }

  const form = document.getElementById("form-login");
  const statusEl = document.getElementById("login-status");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const senha = String(data.get("senha") || "");

    if (email !== CONTA.email || senha !== CONTA.senha) {
      statusEl.textContent = "E-mail ou senha inválidos.";
      return;
    }

    setSession({ email: CONTA.email, nome: CONTA.nome, empresa: CONTA.empresa });
    window.location.href = "./painel.html";
  });
};

const openDrawer = (html) => {
  const drawer = document.getElementById("drawer");
  const body = document.getElementById("drawer-body");
  body.innerHTML = html;
  drawer.hidden = false;
};

const closeDrawer = () => {
  const drawer = document.getElementById("drawer");
  drawer.hidden = true;
  document.getElementById("drawer-body").innerHTML = "";
};

const contratoHtml = (contrato) => `
  <article class="doc-sheet">
    <p class="eyebrow">Contrato</p>
    <h2 id="drawer-title">${contrato.titulo}</h2>
    <p><strong>${contrato.numero}</strong> · <span class="${badgeClass(contrato.status)}">${contrato.status}</span></p>
    <p>Contratante: ${CONTA.empresa}<br />CNPJ: ${CONTA.documento}</p>
    <p>Vigência: ${dataBR(contrato.inicio)} a ${dataBR(contrato.fim)}</p>
    <p>Objeto: ${contrato.objeto}</p>
    <p>Contratada: NydzaTech Solutions · nydzatech@proton.me · (41) 3797-3450</p>
    <div class="doc-actions">
      <button class="btn btn-primary" type="button" onclick="window.print()">Imprimir / salvar PDF</button>
    </div>
  </article>
`;

const faturaHtml = (fatura) => `
  <article class="doc-sheet">
    <p class="eyebrow">Fatura</p>
    <h2 id="drawer-title">${fatura.numero}</h2>
    <p>Competência ${fatura.competencia} · vencimento ${dataBR(fatura.vencimento)}</p>
    <p><span class="${badgeClass(fatura.status)}">${fatura.status}</span></p>
    <p>Cliente: ${CONTA.empresa}<br />CNPJ: ${CONTA.documento}</p>
    <ul>${fatura.itens.map((item) => `<li>${item}</li>`).join("")}</ul>
    <p><strong>Total: ${brl.format(fatura.valor)}</strong></p>
    <div class="doc-actions">
      <button class="btn btn-primary" type="button" onclick="window.print()">Imprimir 2ª via</button>
    </div>
  </article>
`;

const renderPainel = () => {
  const session = getSession();
  if (!session) {
    window.location.replace("./");
    return;
  }

  document.getElementById("user-chip").textContent = session.empresa;
  document.getElementById("saudacao").textContent = `Olá, ${session.nome.split(" ")[0]}.`;
  document.getElementById("empresa-linha").textContent =
    `${CONTA.empresa} · CNPJ ${CONTA.documento}`;

  const ativos = CONTA.planos.filter((p) => p.status === "ativo");
  const vigentes = CONTA.contratos.filter((c) => c.status === "vigente");
  const proxima = CONTA.faturas
    .filter((f) => f.status === "pendente")
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))[0];

  document.getElementById("resumo-planos").textContent = String(ativos.length);
  document.getElementById("resumo-contratos").textContent = String(vigentes.length);
  document.getElementById("resumo-vencimento").textContent = proxima
    ? `${dataBR(proxima.vencimento)} · ${brl.format(proxima.valor)}`
    : "Em dia";

  document.getElementById("lista-planos").innerHTML = CONTA.planos
    .map(
      (plano) => `
      <article class="account-card">
        <header>
          <h3>${plano.nome}</h3>
          <span class="${badgeClass(plano.status)}">${plano.status}</span>
        </header>
        <p class="account-meta">${plano.ciclo} · ${brl.format(plano.valor)} · renovação em ${dataBR(plano.renovacao)}</p>
        <p class="account-meta">${plano.descricao}</p>
      </article>
    `
    )
    .join("");

  document.getElementById("lista-contratos").innerHTML = CONTA.contratos
    .map(
      (contrato) => `
      <article class="account-card">
        <header>
          <h3>${contrato.titulo}</h3>
          <span class="${badgeClass(contrato.status)}">${contrato.status}</span>
        </header>
        <p class="account-meta">${contrato.numero} · ${dataBR(contrato.inicio)} a ${dataBR(contrato.fim)}</p>
        <p class="account-meta">${contrato.objeto}</p>
        <p><button class="link-btn" type="button" data-contrato="${contrato.id}">Ver contrato</button></p>
      </article>
    `
    )
    .join("");

  document.getElementById("lista-faturas").innerHTML = CONTA.faturas
    .map(
      (fatura) => `
      <tr>
        <td>${fatura.numero}</td>
        <td>${fatura.competencia}</td>
        <td>${dataBR(fatura.vencimento)}</td>
        <td>${brl.format(fatura.valor)}</td>
        <td><span class="${badgeClass(fatura.status)}">${fatura.status}</span></td>
        <td><button class="link-btn" type="button" data-fatura="${fatura.id}">Ver 2ª via</button></td>
      </tr>
    `
    )
    .join("");

  document.getElementById("btn-sair").addEventListener("click", () => {
    clearSession();
    window.location.href = "./";
  });

  document.getElementById("lista-contratos").addEventListener("click", (event) => {
    const id = event.target.dataset.contrato;
    if (!id) return;
    const contrato = CONTA.contratos.find((item) => item.id === id);
    if (contrato) openDrawer(contratoHtml(contrato));
  });

  document.getElementById("lista-faturas").addEventListener("click", (event) => {
    const id = event.target.dataset.fatura;
    if (!id) return;
    const fatura = CONTA.faturas.find((item) => item.id === id);
    if (fatura) openDrawer(faturaHtml(fatura));
  });

  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  document.getElementById("drawer").addEventListener("click", (event) => {
    if (event.target.id === "drawer") closeDrawer();
  });

  const tabs = document.querySelectorAll(".tab");
  const panels = {
    planos: document.getElementById("painel-planos"),
    contratos: document.getElementById("painel-contratos"),
    faturamento: document.getElementById("painel-faturamento"),
  };

  const showTab = (name) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    Object.entries(panels).forEach(([key, panel]) => {
      const active = key === name;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
    history.replaceState(null, "", `#${name}`);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showTab(tab.dataset.tab));
  });

  const inicial = window.location.hash.replace("#", "");
  if (panels[inicial]) showTab(inicial);
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("form-login")) initLogin();
  if (document.getElementById("painel")) renderPainel();
});

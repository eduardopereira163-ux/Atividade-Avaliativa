const form = document.getElementById("formConsulta"); 
const mensagem = document.getElementById("mensagem"); 
  
form.addEventListener("submit", (event) => { 
  event.preventDefault(); 
  const entrada = document.getElementById("cep").value.trim(); 
  const cidade = document.getElementById("cidade") 
    .value.trim().replace(/\s+/g, " "); 
  mensagem.textContent = ""; 
  mensagem.classList.remove("erro");

 if (!/^\d{5}-?\d{3}$/.test(entrada)) { 
    mensagem.textContent = "Informe um CEP com 8 números.";
    mensagem.classList.add("erro");
    return; 
}
  if (!cidade) { 
    mensagem.textContent = "Informe a cidade.";
    mensagem.classList.add("erro");
    return; 
}
  const cep = entrada.replace("-", ""); 
  const parametros = new URLSearchParams({ cep, cidade }); 
  window.location.href = `resultado.html?${parametros}`; 
});
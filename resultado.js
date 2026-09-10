const parametros = new URLSearchParams(window.location.search); 
const cep = parametros.get("cep") || ""; 
const cidadeInformada = parametros.get("cidade") || ""; 
const resultado = document.getElementById("resultado"); 
const linkMaps = document.getElementById("linkMaps"); 
  
function normalizar(texto) { 
  return texto.normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase().trim().replace(/\s+/g, " "); 
} 
  
function mostrarCampo(rotulo, valor) { 
  const linha = document.createElement("p"); 
  const titulo = document.createElement("strong"); 
  titulo.textContent = `${rotulo}: `; 
  linha.append(titulo, valor || "Não informado"); 
  resultado.append(linha); 
} 
  
async function consultarEndereco() { 
  linkMaps.hidden = true; 
  if (!/^\d{8}$/.test(cep) || !cidadeInformada.trim()) { 
    resultado.textContent = 
      "Dados inválidos. Volte e informe CEP e cidade."; 
    return; 
  } 
  resultado.textContent = "Consultando endereço..."; 
  const controle = new AbortController(); 
  const limite = setTimeout(() => controle.abort(), 10000);  try { 
    const resposta = await fetch( 
      `https://viacep.com.br/ws/${cep}/json/`, 
      { signal: controle.signal } 
    ); 
    if (!resposta.ok) { 
      throw new Error("Falha HTTP"); 
    } 
    const dados = await resposta.json(); 
    if (dados.erro) { 
      resultado.textContent = "CEP não encontrado."; 
      return; 
    } 
    if (!dados.localidade || !dados.uf || !dados.cep) { 
      throw new Error("Resposta incompleta"); 
    } 
    if (normalizar(cidadeInformada) !== 
        normalizar(dados.localidade)) { 
      resultado.textContent = 
        `Este CEP pertence a ${dados.localidade}/${dados.uf}, ` + 
        `e não a ${cidadeInformada}. Faça uma nova consulta.`; 
      return; 
    } 
  
    resultado.replaceChildren(); 
    const campos = [ 
      ["CEP", dados.cep], 
      ["Logradouro", dados.logradouro], 
      ["Complemento", dados.complemento], 
      ["Bairro", dados.bairro], 
      ["Cidade", dados.localidade], 
      ["Estado", dados.estado], 
      ["UF", dados.uf] 
    ]; 
    campos.forEach(([rotulo, valor]) => { 
      mostrarCampo(rotulo, valor); 
    }); const endereco = [ 
      dados.logradouro, dados.complemento, dados.bairro, 
      dados.localidade, dados.estado, dados.uf, dados.cep 
    ].filter(Boolean).join(", "); 
    mostrarCampo("Endereço completo disponível", endereco); 
  
    const busca = encodeURIComponent(`${endereco}, Brasil`); 
    linkMaps.href = 
      `https://www.google.com/maps/search/?api=1&query=${busca}`; 
    linkMaps.hidden = false; 
  } catch (erro) { 
    resultado.textContent = erro.name === "AbortError" 
      ? "A consulta demorou demais. Tente novamente." 
      : "Não foi possível consultar. Verifique a conexão " + 
        "e tente novamente."; 
  } finally { 
    clearTimeout(limite); 
  } 
} 
  
consultarEndereco(); 
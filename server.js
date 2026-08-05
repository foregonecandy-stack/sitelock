const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// ===== LÓGICA DO BANCO (extraída do index.html) =====
const ADMIN_EMAILS = ['prefeitodamelhorcidade@lockwood.net', 'bot@lockwood.net'];
function isAdminAllowed(user) {
  return !!(user && ADMIN_EMAILS.includes((user.email || '').toLowerCase()));
}

function demoNow() { return new Date().toISOString(); }

function seedDemoDb() {
  const now = Date.now();
  return {
    nextIds: { user: 3, post: 3, comentario: 2, curtida: 1, amizade: 2, mensagem: 3, voto: 1, grupo: 1, mensagemGrupo: 1, recado: 1, noticia: 1, evento: 1, comentarioNoticia: 1, rsvp: 1 },
    // --- dados da "cidade" (Lockwood) ---
    cidade: {
      clima: { condicao: 'nublado', temp: 18, icone: '☁️', atualizadoEm: new Date(now).toISOString(), atualizadoPor: 2 },
      horaManual: null, // null = horário real; número 0-23 = horário definido pela prefeitura
      radioEstacoes: [
        { id: 1, nome: 'Lockwood FM 98.5', genero: 'Pop/Rock anos 2000', playlistUrl: '', cor: '#ff5470' },
        { id: 2, nome: 'Rádio Sertão AM', genero: 'Sertanejo/Forro', playlistUrl: '', cor: '#f5a623' },
        { id: 3, nome: 'Rock da Cidade', genero: 'Rock/Alternativo', playlistUrl: '', cor: '#00e5ff' },
        { id: 4, nome: 'Lockwood Lofi', genero: 'Lofi/Chill', playlistUrl: '', cor: '#a78bfa' },
        { id: 5, nome: 'Rádio Mistério', genero: 'Ambiente/Suspense', playlistUrl: '', cor: '#39ff14' },
      ],
      radioEstacaoAtiva: 1,
      radioAleatorio: false,
    },
    noticias: [
      { id: 1, autorId: 2, manchete: 'BEM-VINDOS A LOCKWOOD — A CIDADE ESTÁ DE PORTAS ABERTAS', corpo: 'Prezados moradores,\n\nÉ com enorme alegria que a Prefeitura de Lockwood anuncia a inauguração oficial da nossa rede municipal! Depois de muito trabalho, a praça central ganhou fôlego novo e agora todos podem se conectar, conversar e compartilhar momentos desta nossa querida cidade.\n\nO que você encontra por aqui:\n\n📰 O Lockwood Times — nosso jornal oficial, com as notícias que importam pra cidade. Deixe seu comentário e participe!\n\n📅 Eventos da cidade — festas, reuniões e acontecimentos. Marque sua presença e não perca nada.\n\n📻 Rádio Lockwood FM — cinco estações pra você ouvir enquanto navega. Pop, sertanejo, rock, lofi e ambiente. É só apertar o play.\n\n🌤️ Clima do dia — fique por dentro de como está o tempo lá fora antes de sair de casa.\n\n💬 Mural da cidade — poste suas fotos, pensamentos, recados e enquetes. É o coração pulsante de Lockwood!\n\nEsta é a nossa cidade. Cada morador faz parte dessa história. Cadastrem-se, encham o mural de vida, deixem recados nos perfis dos vizinhos e vamos fazer de Lockwood o melhor lugar pra se estar.\n\nAs portas estão abertas. Sejam bem-vindos.\n\n— A Prefeitura de Lockwood 🏘️', dataCriacao: new Date(now - 48 * 3600000).toISOString(), fixado: true },
    ],
    comentariosNoticia: [],
    eventos: [
      { id: 1, autorId: 2, titulo: 'Inauguração da Praça Central', descricao: 'Venha celebrar a inauguração da praça renovada! Música ao vivo, comida e boa companhia.', data: new Date(now + 7 * 86400000).toISOString(), local: 'Praça Central de Lockwood', dataCriacao: new Date(now - 24 * 3600000).toISOString() },
    ],
    rsvps: [],
    users: [
      { id: 1, email: 'prefeitodamelhorcidade@lockwood.net', senha: '123456', nome: 'Prefeito', bio: 'vivendo, postando, existindo ✨', linkMusica: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', fotoPerfilUrl: '', bannerUrl: '', amigosPersonalizado: null, desdePersonalizado: null, mood: 'inquietamente viva ✨', titulo: 'Prefeito da Melhor Cidade', tituloCor: '#ffd23f', adminTitulo: '', adminTituloCor: '', tema: 'padrao', dataCriacao: new Date(now - 20 * 86400000).toISOString() },
      { id: 2, email: 'bot@lockwood.net', senha: '123456', nome: 'Lockwood Bot', bio: 'perfil oficial da casa 🤖', linkMusica: '', fotoPerfilUrl: '', bannerUrl: '', amigosPersonalizado: null, desdePersonalizado: null, mood: 'online e vigilante 🤖', titulo: 'Admin & Bot', tituloCor: '#00e5ff', adminTitulo: '', adminTituloCor: '', tema: 'padrao', dataCriacao: new Date(now - 40 * 86400000).toISOString() },
    ],
    posts: [
      { id: 1, autorId: 1, conteudo: 'primeira postagem no lockwood, alguém mais aqui é dos anos 2000? 💜', imagem: '', imagens: [], enquete: null, dataCriacao: new Date(now - 3 * 3600000).toISOString() },
      { id: 2, autorId: 2, conteudo: ' lockwood.net está no ar! 🌆\n\nA prefeitura abre as portas da cidade pra todo mundo. Criem seus perfis, postem no mural, ouçam a rádio e deixem a praça voltar à vida. Sejam bem-vindos a Lockwood! 💜', imagem: '', imagens: [], enquete: null, dataCriacao: new Date(now - 26 * 3600000).toISOString() },
    ],
    comentarios: [
      { id: 1, autorId: 2, postId: 1, conteudo: 'demoraaa 👀', imagem: '', parentId: null, dataCriacao: new Date(now - 2 * 3600000).toISOString() },
    ],
    curtidas: [],
    amizades: [
      { id: 1, solicitanteId: 1, destinatarioId: 2, status: 'aceita' },
    ],
    mensagens: [
      { id: 1, remetenteId: 2, destinatarioId: 1, conteudo: 'oi Ana, bem-vinda de novo 👋', imagem: '', dataCriacao: new Date(now - 5 * 3600000).toISOString() },
      { id: 2, remetenteId: 1, destinatarioId: 2, conteudo: 'valeu! testando as DMs por aqui', imagem: '', dataCriacao: new Date(now - 4.5 * 3600000).toISOString() },
    ],
    votosEnquete: [],
    grupos: [],
    mensagensGrupo: [],
  };
}
function migrateDemoDb(db) {
  db.users = db.users || [];
  db.posts = db.posts || [];
  db.comentarios = db.comentarios || [];
  db.curtidas = db.curtidas || [];
  db.amizades = db.amizades || [];
  db.mensagens = db.mensagens || [];
  db.votosEnquete = db.votosEnquete || [];
  db.grupos = db.grupos || [];
  db.mensagensGrupo = db.mensagensGrupo || [];
  db.recados = db.recados || [];
  db.noticias = db.noticias || [];
  db.comentariosNoticia = db.comentariosNoticia || [];
  db.eventos = db.eventos || [];
  db.rsvps = db.rsvps || [];
  db.notificacoes = db.notificacoes || [];
  db.visitasPerfil = db.visitasPerfil || {};
  // cidade: clima, relógio manual, rádio
  db.cidade = db.cidade || {};
  if (!db.cidade.clima) db.cidade.clima = { condicao: 'nublado', temp: 18, icone: '☁️', atualizadoEm: demoNow(), atualizadoPor: null };
  if (db.cidade.horaManual === undefined) db.cidade.horaManual = null;
  if (!Array.isArray(db.cidade.radioEstacoes) || db.cidade.radioEstacoes.length < 5) {
    db.cidade.radioEstacoes = [
      { id: 1, nome: 'Lockwood FM 98.5', genero: 'Pop/Rock anos 2000', playlistUrl: '', cor: '#ff5470' },
      { id: 2, nome: 'Rádio Sertão AM', genero: 'Sertanejo/Forro', playlistUrl: '', cor: '#f5a623' },
      { id: 3, nome: 'Rock da Cidade', genero: 'Rock/Alternativo', playlistUrl: '', cor: '#00e5ff' },
      { id: 4, nome: 'Lockwood Lofi', genero: 'Lofi/Chill', playlistUrl: '', cor: '#a78bfa' },
      { id: 5, nome: 'Rádio Mistério', genero: 'Ambiente/Suspense', playlistUrl: '', cor: '#39ff14' },
    ];
  }
  if (db.cidade.radioEstacaoAtiva === undefined) db.cidade.radioEstacaoAtiva = 1;
  if (db.cidade.radioAleatorio === undefined) db.cidade.radioAleatorio = false;
  db.comentarios.forEach(c => { if (c.parentId === undefined) c.parentId = null; });
  db.posts.forEach(p => {
    if (p.fixado === undefined) p.fixado = false;
    if (p.editado === undefined) p.editado = false;
    if (p.repostOf === undefined) p.repostOf = null;
    if (p.imagens === undefined) p.imagens = p.imagem ? [p.imagem] : [];
    if (p.enquete === undefined) p.enquete = null;
  });
  db.mensagens.forEach(m => {
    if (m.replyToId === undefined) m.replyToId = null;
    if (m.editado === undefined) m.editado = false;
  });
  db.users.forEach(u => {
    if (u.status === undefined) u.status = 'online';
    if (u.amigosPersonalizado === undefined) u.amigosPersonalizado = null;
    if (u.desdePersonalizado === undefined) u.desdePersonalizado = null;
    if (u.mood === undefined) u.mood = '';
    if (u.titulo === undefined) u.titulo = '';
    if (u.tituloCor === undefined) u.tituloCor = '';
    if (u.adminTitulo === undefined) u.adminTitulo = '';
    if (u.adminTituloCor === undefined) u.adminTituloCor = '';
    if (u.tema === undefined) u.tema = 'padrao';
  });
  // migração de grupos antigos: "membros" costumava ser uma lista simples de
  // ids (todo mundo já "dentro"). Agora cada membro tem um status, pra dar
  // pra aceitar/recusar convite — então quem já estava na lista antiga vira
  // aceito automaticamente, ninguém perde acesso ao converter.
  db.grupos.forEach(g => {
    if (Array.isArray(g.membros) && g.membros.length && typeof g.membros[0] !== 'object') {
      g.membros = g.membros.map(id => ({ id, status: id === g.criadorId ? 'aceito' : 'aceito' }));
    }
    g.membros = g.membros || [];
    if (g.cor === undefined) g.cor = '#a86bff';
  });
  // reações variadas (👍❤️😂😮😢) — antes só existia "curtida" simples;
  // toda curtida antiga vira reação tipo "like" automaticamente.
  db.curtidas.forEach(c => { if (!c.tipo) c.tipo = 'like'; });
  db.nextIds = db.nextIds || {};
  if (db.nextIds.user === undefined) db.nextIds.user = (db.users.reduce((m, u) => Math.max(m, u.id), 0) + 1) || 3;
  if (db.nextIds.post === undefined) db.nextIds.post = (db.posts.reduce((m, p) => Math.max(m, p.id), 0) + 1) || 3;
  if (db.nextIds.comentario === undefined) db.nextIds.comentario = (db.comentarios.reduce((m, c) => Math.max(m, c.id), 0) + 1) || 2;
  if (db.nextIds.curtida === undefined) db.nextIds.curtida = (db.curtidas.reduce((m, c) => Math.max(m, c.id), 0) + 1) || 1;
  if (db.nextIds.amizade === undefined) db.nextIds.amizade = (db.amizades.reduce((m, a) => Math.max(m, a.id), 0) + 1) || 2;
  if (db.nextIds.mensagem === undefined) db.nextIds.mensagem = (db.mensagens.reduce((m, msg) => Math.max(m, msg.id), 0) + 1) || 1;
  if (db.nextIds.voto === undefined) db.nextIds.voto = (db.votosEnquete.reduce((m, v) => Math.max(m, v.id), 0) + 1) || 1;
  if (db.nextIds.grupo === undefined) db.nextIds.grupo = (db.grupos.reduce((m, g) => Math.max(m, g.id), 0) + 1) || 1;
  if (db.nextIds.mensagemGrupo === undefined) db.nextIds.mensagemGrupo = (db.mensagensGrupo.reduce((m, msg) => Math.max(m, msg.id), 0) + 1) || 1;
  if (db.nextIds.recado === undefined) db.nextIds.recado = (db.recados.reduce((m, r) => Math.max(m, r.id), 0) + 1) || 1;
  if (db.nextIds.noticia === undefined) db.nextIds.noticia = (db.noticias.reduce((m, n) => Math.max(m, n.id), 0) + 1) || 1;
  if (db.nextIds.evento === undefined) db.nextIds.evento = (db.eventos.reduce((m, e) => Math.max(m, e.id), 0) + 1) || 1;
  if (db.nextIds.comentarioNoticia === undefined) db.nextIds.comentarioNoticia = (db.comentariosNoticia.reduce((m, c) => Math.max(m, c.id), 0) + 1) || 1;
  if (db.nextIds.rsvp === undefined) db.nextIds.rsvp = (db.rsvps.reduce((m, r) => Math.max(m, r.id), 0) + 1) || 1;
  if (db.nextIds.notificacao === undefined) db.nextIds.notificacao = (db.notificacoes.reduce((m, n) => Math.max(m, n.id), 0) + 1) || 1;
  return db;
}
// (loadDemoDb e saveDemoDb estão definidas mais abaixo com armazenamento em arquivo)

function demoUserPublic(db, id) {
  const u = db.users.find(x => x.id === id);
  return u ? { ...u } : null;
}
function demoGrupoFull(db, g) {
  return {
    ...g,
    membrosInfo: g.membros.filter(m => m.status === 'aceito').map(m => demoUserPublic(db, m.id)).filter(Boolean),
  };
}
function demoPostFull(db, p) {
  const full = { ...p, autor: demoUserPublic(db, p.autorId) };
  if (p.repostOf && p.repostOf !== p.id) {
    const orig = db.posts.find(x => x.id === p.repostOf);
    full.original = orig ? { ...orig, autor: demoUserPublic(db, orig.autorId) } : null;
  }
  return full;
}
function demoComentarioFull(db, c) {
  return { ...c, autor: demoUserPublic(db, c.autorId) };
}
function demoAmizadeFull(db, a) {
  return { ...a, solicitante: demoUserPublic(db, a.solicitanteId), destinatario: demoUserPublic(db, a.destinatarioId) };
}
function demoMensagemFull(db, m) {
  const full = { ...m, remetente: demoUserPublic(db, m.remetenteId), destinatario: demoUserPublic(db, m.destinatarioId) };
  if (m.replyToId) {
    const orig = db.mensagens.find(x => x.id === m.replyToId);
    full.respondendoA = orig ? { ...orig, remetente: demoUserPublic(db, orig.remetenteId) } : null;
  }
  return full;
}
// status de amizade entre dois usuários: 'amigos' | 'pendente_enviado' (a mandou pra b)
// | 'pendente_recebido' (b mandou pra a) | 'nenhum'
function amizadeStatusEntre(db, aId, bId) {
  const a = db.amizades.find(x => (x.solicitanteId === aId && x.destinatarioId === bId) || (x.solicitanteId === bId && x.destinatarioId === aId));
  if (!a) return { status: 'nenhum', amizadeId: null };
  if (a.status === 'aceita') return { status: 'amigos', amizadeId: a.id };
  if (a.solicitanteId === aId) return { status: 'pendente_enviado', amizadeId: a.id };
  return { status: 'pendente_recebido', amizadeId: a.id };
}


// ===== ARMAZENAMENTO EM ARQUIVO + BACKUP NO GITHUB (persistência) =====
const DB_FILE = path.join(__dirname, 'lockwood_db.json');
let _dbCache = null;

// --- Config de backup no GitHub (via variáveis de ambiente na Render) ---
// GITHUB_TOKEN  = Personal Access Token (classic) com permissão "repo"
// GITHUB_REPO   = "usuario/repo" (ex: "joao/lockwood-net")
// GITHUB_BRANCH = branch (default: main)
// GITHUB_DB_PATH= caminho do arquivo no repo (default: lockwood_db.json)
const GH_TOKEN   = process.env.GITHUB_TOKEN   || '';
const GH_REPO    = process.env.GITHUB_REPO    || '';
const GH_BRANCH  = process.env.GITHUB_BRANCH  || 'main';
const GH_DB_PATH = process.env.GITHUB_DB_PATH || 'lockwood_db.json';
const GITHUB_BACKUP_ATIVO = !!(GH_TOKEN && GH_REPO);

// --- Helpers de requisição HTTPS pro GitHub ---
function ghRequest(method, urlPath, bodyObj) {
  return new Promise((resolve, reject) => {
    const bodyStr = bodyObj ? JSON.stringify(bodyObj) : null;
    const opts = {
      method,
      hostname: 'api.github.com',
      path: urlPath,
      headers: {
        'User-Agent': 'lockwood-net',
        'Accept': 'application/vnd.github+json',
        'Authorization': 'Bearer ' + GH_TOKEN,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };
    if (bodyStr) {
      opts.headers['Content-Type'] = 'application/json';
      opts.headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }
    const req = https.request(opts, (res) => {
      let chunks = '';
      res.on('data', (d) => { chunks += d; });
      res.on('end', () => {
        let parsed = null;
        try { parsed = chunks ? JSON.parse(chunks) : null; } catch (e) { parsed = chunks; }
        resolve({ status: res.statusCode, data: parsed });
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// --- Baixa o lockwood_db.json do GitHub (se existir) ---
async function baixarDbDoGitHub() {
  if (!GITHUB_BACKUP_ATIVO) return null;

  // ESTRATÉGIA: tentar raw URL PRIMEIRO (mais confiável, sem limite de 1MB, sem precisar de token)
  // Depois tentar pegar o sha via API (necessário para uploads subsequentes)
  const rawUrl = `https://raw.githubusercontent.com/${GH_REPO}/${encodeURIComponent(GH_BRANCH)}/${encodeURIComponent(GH_DB_PATH)}`;
  
  // 1) Tenta baixar via raw URL (funciona para repos públicos mesmo sem token)
  const raw = await _baixarRawUrl(rawUrl);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      console.log('✅ DB baixada do GitHub via raw URL (' + Math.round(raw.length/1024) + 'KB).');
      // Tenta pegar o sha em paralelo (para uploads futuros) — não bloqueia se falhar
      const sha = await _pegarShaDb();
      return { db: parsed, sha };
    } catch (e) {
      console.error('⚠️ Raw URL retornou JSON inválido:', e.message);
    }
  }

  // 2) Fallback: Contents API (para repos privados onde raw URL não funciona sem token)
  try {
    const r = await ghRequest('GET',
      `/repos/${GH_REPO}/contents/${encodeURIComponent(GH_DB_PATH)}?ref=${encodeURIComponent(GH_BRANCH)}`);
    if (r.status === 200 && r.data) {
      const sha = r.data.sha;
      // Caso A: arquivo pequeno (<=1MB) — o content vem inline em base64
      if (r.data.content) {
        const decoded = Buffer.from(r.data.content, 'base64').toString('utf8');
        const parsed = JSON.parse(decoded);
        console.log('✅ DB baixada do GitHub via Contents API (backup recuperado).');
        return { db: parsed, sha };
      }
      // Caso B: arquivo grande (>1MB) — Git Blobs API
      console.log('ℹ️ DB grande (>1MB) — baixando via Git Blobs API...');
      if (r.data.git_url) {
        const gitPath = r.data.git_url.replace('https://api.github.com', '');
        const rb = await ghRequest('GET', gitPath);
        if (rb.status === 200 && rb.data && rb.data.content) {
          const decoded = Buffer.from(rb.data.content, 'base64').toString('utf8');
          const parsed = JSON.parse(decoded);
          console.log('✅ DB grande baixada do GitHub via Git Blobs API (' + Math.round(decoded.length/1024) + 'KB).');
          return { db: parsed, sha };
        }
      }
      console.log('⚠️ DB encontrada no GitHub mas não foi possível baixar o conteúdo (>1MB).');
      return null;
    }
    if (r.status === 404) {
      console.log('ℹ️ Arquivo de DB ainda não existe no GitHub — usando seed/local (primeiro uso).');
      return null;
    }
    console.log('ℹ️ Arquivo de DB não encontrado no GitHub (HTTP ' + r.status + ') — usando seed/local.');
    return null;
  } catch (e) {
    console.error('⚠️ Erro ao baixar DB do GitHub:', e.message);
    return null;
  }
}

// Helper: baixa conteúdo via raw.githubusercontent.com (HTTPS GET simples, sem auth)
function _baixarRawUrl(url) {
  return new Promise((resolve) => {
    const opts = new URL(url);
    const req = https.get(opts, (res) => {
      let chunks = '';
      // raw.githubusercontent.com pode redirecionar; seguir redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        _baixarRawUrl(res.headers.location).then(resolve);
        return;
      }
      res.on('data', (d) => { chunks += d; });
      res.on('end', () => {
        if (res.statusCode === 200 && chunks) resolve(chunks);
        else resolve(null);
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(10000, () => { req.destroy(); resolve(null); });
  });
}

// Helper: pega o sha do arquivo DB no GitHub (necessário para updates via Contents API)
async function _pegarShaDb() {
  try {
    const r = await ghRequest('GET',
      `/repos/${GH_REPO}/contents/${encodeURIComponent(GH_DB_PATH)}?ref=${encodeURIComponent(GH_BRANCH)}`);
    if (r.status === 200 && r.data && r.data.sha) return r.data.sha;
  } catch (e) {}
  return null;
}

// --- Envia (cria/atualiza) o lockwood_db.json pro GitHub ---
let _ghShaCache = null; // sha do último arquivo no github (necessário pra update)
let _uploadTimer = null;
let _uploadPendente = false;

// Limite do Contents API é 1MB. Para arquivos maiores, usamos Git Data API.
const CONTENTS_API_LIMIT = 1024 * 1024; // 1MB

async function enviarDbParaGitHub(db) {
  if (!GITHUB_BACKUP_ATIVO) return;
  const conteudo = JSON.stringify(db, null, 2);
  const encoded = Buffer.from(conteudo).toString('base64');

  // Se o arquivo for pequeno (<=1MB), usa Contents API (mais simples)
  if (Buffer.byteLength(conteudo) <= CONTENTS_API_LIMIT) {
    await _enviarViaContentsApi(encoded);
    return;
  }

  // Se for grande (>1MB), usa Git Data API (blobs + trees + commits + refs)
  await _enviarViaGitDataApi(encoded);
}

// --- Upload via Contents API (arquivos <= 1MB) ---
async function _enviarViaContentsApi(encoded) {
  const body = {
    message: 'backup automático lockwood_db ' + new Date().toISOString(),
    content: encoded,
    branch: GH_BRANCH,
  };
  if (_ghShaCache) body.sha = _ghShaCache;
  try {
    const r = await ghRequest('PUT',
      `/repos/${GH_REPO}/contents/${encodeURIComponent(GH_DB_PATH)}`, body);
    if (r.status === 200 || r.status === 201) {
      if (r.data && r.data.content && r.data.content.sha) _ghShaCache = r.data.content.sha;
      console.log('✅ Backup enviado pro GitHub (Contents API).');
    } else {
      // se erro 409 (conflito) ou 422 (sha errado), re-busca sha e tenta de novo
      if (r.status === 409 || r.status === 422) {
        const fresh = await baixarDbDoGitHub();
        if (fresh && fresh.sha) {
          _ghShaCache = fresh.sha;
          body.sha = _ghShaCache;
          const r2 = await ghRequest('PUT',
            `/repos/${GH_REPO}/contents/${encodeURIComponent(GH_DB_PATH)}`, body);
          if (r2.status === 200 || r2.status === 201) {
            if (r2.data && r2.data.content && r2.data.content.sha) _ghShaCache = r2.data.content.sha;
            console.log('✅ Backup enviado pro GitHub (Contents API, após retry).');
          } else {
            console.error('⚠️ Falha no retry (Contents API):', r2.status, JSON.stringify(r2.data).slice(0,200));
          }
        }
      } else {
        console.error('⚠️ Falha ao enviar backup (Contents API):', r.status, JSON.stringify(r.data).slice(0,200));
        // Fallback: tenta Git Data API se o erro for por tamanho
        if (r.status === 413 || (r.data && JSON.stringify(r.data).includes('too_large'))) {
          console.log('ℹ️ Arquivo muito grande — tentando Git Data API...');
          await _enviarViaGitDataApi(encoded);
        }
      }
    }
  } catch (e) {
    console.error('⚠️ Erro ao enviar backup (Contents API):', e.message);
  }
}

// --- Upload via Git Data API (arquivos > 1MB, sem limite prático) ---
// Passos: 1) criar blob  2) pegar commit HEAD  3) pegar tree do HEAD
//         4) criar nova tree (sobrescrevendo o arquivo)  5) criar commit  6) atualizar ref
async function _enviarViaGitDataApi(encoded) {
  const MAX_TENTATIVAS = 3;
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    try {
      // 1) Criar blob com o conteúdo (só precisa fazer uma vez — o blob é imutável)
      let blobSha;
      if (tentativa === 1) {
        const rBlob = await ghRequest('POST', `/repos/${GH_REPO}/git/blobs`, {
          content: encoded,
          encoding: 'base64',
        });
        if (rBlob.status !== 200 && rBlob.status !== 201) {
          console.error('⚠️ Git Data: falha ao criar blob:', rBlob.status, JSON.stringify(rBlob.data).slice(0,200));
          return;
        }
        blobSha = rBlob.data.sha;
      }

      // 2) Pegar o SHA do commit HEAD da branch (RE-LENDE a cada tentativa!)
      const rRef = await ghRequest('GET', `/repos/${GH_REPO}/git/refs/heads/${encodeURIComponent(GH_BRANCH)}`);
      if (rRef.status !== 200) {
        console.error('⚠️ Git Data: falha ao pegar ref:', rRef.status, JSON.stringify(rRef.data).slice(0,200));
        return;
      }
      const headCommitSha = rRef.data.object.sha;

      // 3) Pegar a tree do commit HEAD
      const rCommit = await ghRequest('GET', `/repos/${GH_REPO}/git/commits/${headCommitSha}`);
      if (rCommit.status !== 200) {
        console.error('⚠️ Git Data: falha ao pegar commit:', rCommit.status);
        return;
      }
      const baseTreeSha = rCommit.data.tree.sha;

      // 4) Criar nova tree sobrescrevendo o arquivo do DB
      const rTree = await ghRequest('POST', `/repos/${GH_REPO}/git/trees`, {
        base_tree: baseTreeSha,
        tree: [{
          path: GH_DB_PATH,
          mode: '100644',
          type: 'blob',
          sha: blobSha,
        }],
      });
      if (rTree.status !== 200 && rTree.status !== 201) {
        console.error('⚠️ Git Data: falha ao criar tree:', rTree.status, JSON.stringify(rTree.data).slice(0,200));
        return;
      }
      const newTreeSha = rTree.data.sha;

      // 5) Criar commit apontando para a nova tree, com pai = HEAD atual
      const rNewCommit = await ghRequest('POST', `/repos/${GH_REPO}/git/commits`, {
        message: 'backup automático lockwood_db (large) ' + new Date().toISOString(),
        tree: newTreeSha,
        parents: [headCommitSha],
      });
      if (rNewCommit.status !== 200 && rNewCommit.status !== 201) {
        console.error('⚠️ Git Data: falha ao criar commit:', rNewCommit.status, JSON.stringify(rNewCommit.data).slice(0,200));
        return;
      }
      const newCommitSha = rNewCommit.data.sha;

      // 6) Atualizar a ref da branch para apontar para o novo commit
      // Tenta fast-forward primeiro (force: false). Se falhar com 422 (não é
      // fast-forward — alguém fez push entre a leitura do HEAD e agora),
      // re-le o HEAD e tenta de novo. Na última tentativa, usa force: true.
      const usarForce = (tentativa === MAX_TENTATIVAS);
      const rUpdateRef = await ghRequest('PATCH', `/repos/${GH_REPO}/git/refs/heads/${encodeURIComponent(GH_BRANCH)}`, {
        sha: newCommitSha,
        force: usarForce,
      });
      if (rUpdateRef.status === 200) {
        _ghShaCache = null; // invalida cache do Contents API
        console.log('✅ Backup grande enviado pro GitHub (Git Data API, ' + Math.round(encoded.length/1024) + 'KB encoded' + (usarForce ? ', force' : '') + ').');
        return; // sucesso!
      }

      // 422 = "Update is not a fast forward" — o HEAD mudou no meio do caminho
      if (rUpdateRef.status === 422 && tentativa < MAX_TENTATIVAS) {
        console.warn('⚠️ Git Data: ref não é fast-forward (tentativa ' + tentativa + '/' + MAX_TENTATIVAS + ') — re-lendo HEAD e tentando de novo...');
        await new Promise(r => setTimeout(r, 1500)); // espera 1.5s antes de tentar de novo
        continue; // volta pro início do loop com tentativa++
      }

      // Outro erro ou esgotou as tentativas
      console.error('⚠️ Git Data: falha ao atualizar ref:', rUpdateRef.status, JSON.stringify(rUpdateRef.data).slice(0,200));
      return;
    } catch (e) {
      console.error('⚠️ Erro ao enviar backup (Git Data API, tentativa ' + tentativa + '):', e.message);
      if (tentativa < MAX_TENTATIVAS) {
        await new Promise(r => setTimeout(r, 1500));
        continue;
      }
      return;
    }
  }
}

// --- Agenda o upload com debounce (junta várias salvadas numa só) ---
let _ultimoBackupTs = 0;
const BACKUP_INTERVALO_MS = 30000;
let _backupIntervalTimer = null;
let _primeiraSalvada = true;
let _shuttingDown = false;

function agendarBackupGitHub() {
  if (!GITHUB_BACKUP_ATIVO) return;
  // PRIMEIRA salvada apos boot: manda IMEDIATO (nao espera debounce)
  if (_primeiraSalvada) {
    _primeiraSalvada = false;
    if (_dbCache) {
      enviarDbParaGitHub(_dbCache).then(() => { _ultimoBackupTs = Date.now(); }).catch(e => {});
    }
    return;
  }
  // Salvadas subsequentes: debounce de 4s
  if (_uploadTimer) clearTimeout(_uploadTimer);
  _uploadTimer = setTimeout(async () => {
    _uploadTimer = null;
    if (_dbCache) {
      try { await enviarDbParaGitHub(_dbCache); _ultimoBackupTs = Date.now(); } catch (e) {}
    }
  }, 4000);
}

// Backup periodico automatico (garantia: mesmo sem atividade, sobe a cada 30s)
function iniciarBackupPeriodico() {
  if (!GITHUB_BACKUP_ATIVO) return;
  if (_backupIntervalTimer) clearInterval(_backupIntervalTimer);
  _backupIntervalTimer = setInterval(async () => {
    if (!_dbCache) return;
    if (Date.now() - _ultimoBackupTs < BACKUP_INTERVALO_MS) return;
    try { await enviarDbParaGitHub(_dbCache); _ultimoBackupTs = Date.now(); } catch (e) {}
  }, BACKUP_INTERVALO_MS);
}

// Backup de emergencia: captura SIGTERM/SIGINT (Render manda SIGTERM antes de dormir)
async function backupEmergencia(sinal) {
  if (_shuttingDown) return;
  _shuttingDown = true;
  console.log(sinal + ' recebido - fazendo backup final do banco no GitHub...');
  if (_uploadTimer) { clearTimeout(_uploadTimer); _uploadTimer = null; }
  if (_backupIntervalTimer) { clearInterval(_backupIntervalTimer); _backupIntervalTimer = null; }
  if (GITHUB_BACKUP_ATIVO && _dbCache) {
    try { await enviarDbParaGitHub(_dbCache); console.log('Backup final enviado com sucesso!'); } catch (e) { console.error('Erro no backup final:', e.message); }
  }
  // so salva arquivo local se o cache existe (evita sobrescrever com null)
  if (_dbCache) {
    try { fs.writeFileSync(DB_FILE, JSON.stringify(_dbCache, null, 2)); } catch (e) {}
  }
  process.exit(0);
}
process.on('SIGTERM', () => backupEmergencia('SIGTERM'));
process.on('SIGINT', () => backupEmergencia('SIGINT'));

async function loadDemoDb() {
  if (_dbCache) return _dbCache;
  // 1) Tenta baixar do GitHub (persistência entre reinícios)
  const remoto = await baixarDbDoGitHub();
  if (remoto && remoto.db) {
    _ghShaCache = remoto.sha;
    _dbCache = migrateDemoDb(remoto.db);
    // garante cópia local também
    try { fs.writeFileSync(DB_FILE, JSON.stringify(_dbCache, null, 2)); } catch (e) {}
    return _dbCache;
  }
  // 2) Tenta arquivo local (caso exista na mesma sessão)
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      _dbCache = migrateDemoDb(parsed);
      return _dbCache;
    }
  } catch (e) {
    console.error('Erro ao ler DB local:', e.message);
  }
  // 3) Primeiro uso: cria o seed
  _dbCache = migrateDemoDb(seedDemoDb());
  saveDemoDb(_dbCache);
  return _dbCache;
}

async function saveDemoDb(db) {
  _dbCache = db;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('Erro ao salvar DB local:', e.message);
  }
  // agenda backup no GitHub (com debounce)
  agendarBackupGitHub();
}

// No boot: se o backup GitHub está ativo, pré-busca o sha em paralelo
// (já é feito dentro de loadDemoDb, mas logamos o estado)
if (GITHUB_BACKUP_ATIVO) {
  console.log('🔒 Backup no GitHub ATIVO → repo:', GH_REPO, '| branch:', GH_BRANCH, '| path:', GH_DB_PATH);
  // inicia backup periodico automatico (a cada 30s)
  iniciarBackupPeriodico();
  console.log('⏰ Backup periódico automático ativado (a cada 30s) + backup de emergência no SIGTERM.');
} else {
  console.log('⚠️ Backup no GitHub DESATIVADO (configure GITHUB_TOKEN e GITHUB_REPO na Render para persistência).');
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
// tipos: 'curtida', 'comentario', 'amizade_solicitada', 'amizade_aceita',
//        'mensagem', 'recado', 'mensagem_grupo', 'comentario_noticia', 'rsvp'
function criarNotificacao(db, { usuarioId, tipo, deId, postId, grupoId, noticiaId, eventoId, extra }) {
  // não notifica a si mesmo
  if (usuarioId === deId) return;
  // não notifica usuário inexistente
  if (!db.users.some(u => u.id === usuarioId)) return;
  const n = {
    id: db.nextIds.notificacao++,
    usuarioId,        // destinatário
    tipo,
    deId: deId || null,
    postId: postId || null,
    grupoId: grupoId || null,
    noticiaId: noticiaId || null,
    eventoId: eventoId || null,
    extra: extra || null,  // texto livre (ex: nome do grupo, trecho da msg)
    lida: false,
    dataCriacao: demoNow(),
  };
  db.notificacoes.push(n);
}

async function mockApi(path, { method = 'GET', body } = {}) {
  await new Promise(r => setTimeout(r, 150));
  const url = new URL(path, 'https://demo.local');
  const pathname = url.pathname;
  const q = url.searchParams;
  const db = await loadDemoDb();
  const key = `${method} ${pathname}`;

  const fail = (msg) => { throw new Error(msg); };

  switch (key) {
    case 'POST /user/cadastrarUsuario': {
      if (db.users.some(u => u.email === body.email)) fail('Já existe uma conta com esse e-mail.');
      const user = { id: db.nextIds.user++, email: body.email, senha: body.senha, nome: body.nome, bio: '', linkMusica: '', fotoPerfilUrl: '', bannerUrl: '', amigosPersonalizado: null, desdePersonalizado: null, mood: '', titulo: '', tituloCor: '', adminTitulo: '', adminTituloCor: '', tema: 'padrao', dataCriacao: demoNow() };
      db.users.push(user);
      db.amizades.push({ id: db.nextIds.amizade++, solicitanteId: 1, destinatarioId: user.id, status: 'pendente' });
      await saveDemoDb(db);
      return 'Usuário criado com sucesso';
    }
    case 'POST /auth/login': {
      const user = db.users.find(u => u.email === body.email && u.senha === body.senha);
      if (!user) fail('E-mail ou senha inválidos.');
      return { ...user };
    }
    case 'GET /user/buscarUsuario': {
      const user = demoUserPublic(db, parseInt(q.get('id')));
      if (!user) fail('Usuário não encontrado.');
      // Adiciona info de nível
      const nivelInfo = calcularStatsUsuario(db, user);
      return { ...user, nivelInfo };
    }
    case 'GET /user/listarUsuario':
      return db.users.map(u => ({ ...u }));
    case 'PUT /user/atualizarUsuario': {
      const idx = db.users.findIndex(u => u.id === body.id);
      if (idx === -1) fail('Usuário não encontrado.');
      db.users[idx] = { ...db.users[idx], ...body.user, id: db.users[idx].id, email: db.users[idx].email, senha: db.users[idx].senha };
      await saveDemoDb(db);
      return 'Usuário atualizado com sucesso';
    }
    case 'DELETE /user/deletarUsuario': {
      const uid = parseInt(q.get('id'));
      db.users = db.users.filter(u => u.id !== uid);
      db.posts = db.posts.filter(p => p.autorId !== uid);
      const remainingPostIds = new Set(db.posts.map(p => p.id));
      db.comentarios = db.comentarios.filter(c => c.autorId !== uid && remainingPostIds.has(c.postId));
      db.curtidas = db.curtidas.filter(c => c.autorId !== uid && remainingPostIds.has(c.postId));
      db.amizades = db.amizades.filter(a => a.solicitanteId !== uid && a.destinatarioId !== uid);
      db.mensagens = db.mensagens.filter(m => m.remetenteId !== uid && m.destinatarioId !== uid);
      db.grupos.forEach(g => { g.membros = g.membros.filter(m => m.id !== uid); });
      await saveDemoDb(db);
      return null;
    }
    case 'POST /post/criarPost': {
      const imagens = Array.isArray(body.imagens) && body.imagens.length ? body.imagens : (body.imagem ? [body.imagem] : []);
      const post = { id: db.nextIds.post++, autorId: body.idAutor, conteudo: body.conteudo || '', imagem: imagens[0] || '', imagens, enquete: body.enquete || null, repostOf: body.repostOf || null, fixado: false, editado: false, dataCriacao: demoNow() };
      db.posts.push(post);
      await saveDemoDb(db);
      return 'Post criado com sucesso';
    }
    case 'PUT /post/editarPost': {
      const p = db.posts.find(x => x.id === body.id);
      if (!p) fail('Post não encontrado.');
      const imagens = Array.isArray(body.imagens) && body.imagens.length ? body.imagens : (body.imagem ? [body.imagem] : []);
      p.conteudo = body.conteudo || '';
      p.imagem = imagens[0] || '';
      p.imagens = imagens;
      p.editado = true;
      await saveDemoDb(db);
      return 'Post atualizado';
    }
    case 'POST /post/votarEnquete': {
      const idPost = parseInt(q.get('idPost')), opcaoIndex = parseInt(q.get('opcaoIndex')), idAutor = parseInt(q.get('idAutor'));
      db.votosEnquete = db.votosEnquete.filter(v => !(v.postId === idPost && v.autorId === idAutor));
      db.votosEnquete.push({ id: db.nextIds.voto++, postId: idPost, opcaoIndex, autorId: idAutor });
      await saveDemoDb(db);
      return 'Voto registrado';
    }
    case 'GET /post/resultadoEnquete': {
      const idPost = parseInt(q.get('idPost')), idAutor = parseInt(q.get('idAutor'));
      const post = db.posts.find(p => p.id === idPost);
      const nOpcoes = post && post.enquete ? post.enquete.opcoes.length : 0;
      const contagens = new Array(nOpcoes).fill(0);
      let meuVoto = null;
      db.votosEnquete.filter(v => v.postId === idPost).forEach(v => {
        if (v.opcaoIndex >= 0 && v.opcaoIndex < nOpcoes) contagens[v.opcaoIndex]++;
        if (v.autorId === idAutor) meuVoto = v.opcaoIndex;
      });
      return { contagens, total: contagens.reduce((a, b) => a + b, 0), meuVoto };
    }
    case 'POST /grupo/criar': {
      // quem cria entra direto; todo mundo mais convidado começa "pendente"
      // e precisa aceitar antes de aparecer na lista de grupos da pessoa.
      const membros = [
        { id: body.criadorId, status: 'aceito' },
        ...body.membros.filter(id => id !== body.criadorId).map(id => ({ id, status: 'pendente' })),
      ];
      const grupo = { id: db.nextIds.grupo++, nome: body.nome, criadorId: body.criadorId, membros, cor: (body.cor && /^#[0-9a-fA-F]{6}$/.test(body.cor) ? body.cor : '#a86bff'), dataCriacao: demoNow() };
      db.grupos.push(grupo);
      // notifica os convidados
      membros.forEach(m => {
        if (m.status === 'pendente') criarNotificacao(db, { usuarioId: m.id, tipo: 'convite_grupo', deId: body.criadorId, grupoId: grupo.id, extra: body.nome });
      });
      await saveDemoDb(db);
      return demoGrupoFull(db, grupo);
    }
    case 'GET /grupo/meusGrupos': {
      const uid = parseInt(q.get('idUsuario'));
      return db.grupos.filter(g => g.membros.some(m => m.id === uid && m.status === 'aceito')).map(g => demoGrupoFull(db, g));
    }
    case 'GET /grupo/convitesPendentes': {
      const uid = parseInt(q.get('idUsuario'));
      return db.grupos.filter(g => g.membros.some(m => m.id === uid && m.status === 'pendente')).map(g => ({
        ...demoGrupoFull(db, g),
        convidadoPor: demoUserPublic(db, g.criadorId),
      }));
    }
    case 'PUT /grupo/convite/aceitar': {
      const grupoId = parseInt(q.get('grupoId')), userId = parseInt(q.get('userId'));
      const g = db.grupos.find(x => x.id === grupoId);
      if (!g) fail('Convite não encontrado — o grupo pode ter sido apagado.');
      const m = g.membros.find(x => x.id === userId);
      if (!m) fail('Convite não encontrado.');
      m.status = 'aceito';
      await saveDemoDb(db);
      return demoGrupoFull(db, g);
    }
    case 'PUT /grupo/convite/recusar': {
      const grupoId = parseInt(q.get('grupoId')), userId = parseInt(q.get('userId'));
      const g = db.grupos.find(x => x.id === grupoId);
      if (g) g.membros = g.membros.filter(m => m.id !== userId);
      await saveDemoDb(db);
      return null;
    }
    case 'GET /grupo/buscar': {
      const g = db.grupos.find(x => x.id === parseInt(q.get('id')));
      if (!g) fail('Grupo não encontrado.');
      return demoGrupoFull(db, g);
    }
    case 'PUT /grupo/atualizarCor': {
      const g = db.grupos.find(x => x.id === (parseInt(q.get('grupoId')) || parseInt(body && body.grupoId)));
      if (!g) fail('Grupo não encontrado.');
      const userId = parseInt(q.get('userId')) || parseInt(body && body.userId);
      const solicitante = db.users.find(u => u.id === userId);
      if (!solicitante) fail('Usuário não encontrado.');
      const isCriador = g.criadorId === solicitante.id;
      const isAdmin = isAdminAllowed(solicitante);
      if (!isCriador && !isAdmin) fail('Só o criador do grupo ou um administrador pode mudar a cor.');
      const novaCor = (body && body.cor && /^#[0-9a-fA-F]{6}$/.test(body.cor)) ? body.cor : '#a86bff';
      g.cor = novaCor;
      await saveDemoDb(db);
      return demoGrupoFull(db, g);
    }
    case 'PUT /perfil/atualizarTema': {
      const userId = parseInt(q.get('userId')) || parseInt(body && body.idUsuario);
      const u = db.users.find(x => x.id === userId);
      if (!u) fail('Usuário não encontrado.');
      const temasValidos = ['padrao','roxo','rosa','verde','azul','dourado','vermelho','preto','cyberpunk','oceano','floresta','galaxia','lava','mint','coral','vapor'];
      const novoTema = (body && body.tema && temasValidos.includes(body.tema)) ? body.tema : 'padrao';
      u.tema = novoTema;
      await saveDemoDb(db);
      return u;
    }
    case 'DELETE /grupo/sair': {
      const grupoId = parseInt(q.get('grupoId')), userId = parseInt(q.get('userId'));
      const g = db.grupos.find(x => x.id === grupoId);
      if (g) g.membros = g.membros.filter(m => m.id !== userId);
      await saveDemoDb(db);
      return null;
    }
    case 'POST /grupo/mensagem/enviar': {
      const grupoId = parseInt(q.get('grupoId')), autorId = parseInt(q.get('autorId'));
      if (!body || (!body.conteudo && !body.imagem)) fail('Escreva algo ou anexe uma imagem.');
      const msg = { id: db.nextIds.mensagemGrupo++, grupoId, autorId, conteudo: (body.conteudo || '').trim(), imagem: body.imagem || '', dataCriacao: demoNow() };
      db.mensagensGrupo.push(msg);
      // notifica os membros do grupo (exceto o autor)
      const grupo = db.grupos.find(g => g.id === grupoId);
      if (grupo && Array.isArray(grupo.membros)) {
        const nomeGrupo = grupo.nome || 'grupo';
        grupo.membros.forEach(m => {
          if (m.status === 'aceito' && m.id !== autorId) {
            criarNotificacao(db, { usuarioId: m.id, tipo: 'mensagem_grupo', deId: autorId, grupoId, extra: nomeGrupo });
          }
        });
      }
      await saveDemoDb(db);
      return { ...msg, autor: demoUserPublic(db, autorId) };
    }
    case 'GET /grupo/mensagens': {
      const grupoId = parseInt(q.get('grupoId'));
      return db.mensagensGrupo.filter(m => m.grupoId === grupoId)
        .sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao))
        .map(m => ({ ...m, autor: demoUserPublic(db, m.autorId) }));
    }
    case 'DELETE /grupo/mensagem/deletar':
      db.mensagensGrupo = db.mensagensGrupo.filter(m => m.id !== parseInt(q.get('id')));
      await saveDemoDb(db);
      return null;
    case 'POST /post/fixar': {
      const pid = parseInt(q.get('id'));
      const p = db.posts.find(x => x.id === pid);
      if (!p) fail('Post não encontrado.');
      const novoValor = !p.fixado;
      if (novoValor) db.posts.forEach(x => { if (x.autorId === p.autorId) x.fixado = false; });
      p.fixado = novoValor;
      await saveDemoDb(db);
      return { fixado: p.fixado };
    }
    case 'GET /post/buscarPost': {
      const post = db.posts.find(p => p.id === parseInt(q.get('id')));
      if (!post) fail('Post não encontrado.');
      return demoPostFull(db, post);
    }
    case 'GET /post/listarPost':
      return [...db.posts].sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)).map(p => demoPostFull(db, p));
    case 'GET /post/listarPostsPorAutor':
      return db.posts.filter(p => p.autorId === parseInt(q.get('id')))
        .sort((a, b) => (b.fixado ? 1 : 0) - (a.fixado ? 1 : 0) || new Date(b.dataCriacao) - new Date(a.dataCriacao))
        .map(p => demoPostFull(db, p));
    case 'DELETE /post/deletarPost': {
      const postId = parseInt(q.get('id'));
      db.posts = db.posts.filter(p => p.id !== postId);
      db.comentarios = db.comentarios.filter(c => c.postId !== postId);
      db.curtidas = db.curtidas.filter(c => c.postId !== postId);
      await saveDemoDb(db);
      return null;
    }
    case 'POST /comentario/criarComentario': {
      const c = { id: db.nextIds.comentario++, autorId: body.idAutor, postId: body.idPost, conteudo: body.conteudo, imagem: body.imagem || '', parentId: body.parentId || null, dataCriacao: demoNow() };
      db.comentarios.push(c);
      // notifica o dono do post
      const post = db.posts.find(p => p.id === body.idPost);
      if (post) criarNotificacao(db, { usuarioId: post.autorId, tipo: 'comentario', deId: body.idAutor, postId: body.idPost });
      // se for resposta a outro comentário, notifica também o autor do comentário pai
      if (body.parentId) {
        const pai = db.comentarios.find(x => x.id === body.parentId);
        if (pai && pai.autorId !== post?.autorId) criarNotificacao(db, { usuarioId: pai.autorId, tipo: 'comentario', deId: body.idAutor, postId: body.idPost });
      }
      await saveDemoDb(db);
      return 'Comentário criado com sucesso';
    }
    case 'GET /comentario/buscarComentario': {
      const c = db.comentarios.find(x => x.id === parseInt(q.get('id')));
      if (!c) fail('Comentário não encontrado.');
      return demoComentarioFull(db, c);
    }
    case 'GET /comentario/listarComentariosPorPost':
      return db.comentarios.filter(c => c.postId === parseInt(q.get('id'))).map(c => demoComentarioFull(db, c));
    case 'DELETE /comentario/deletarComentario': {
      const targetId = parseInt(q.get('id'));
      const idsToDelete = new Set([targetId]);
      let added = true;
      while (added) {
        added = false;
        db.comentarios.forEach(c => {
          if (c.parentId && idsToDelete.has(c.parentId) && !idsToDelete.has(c.id)) {
            idsToDelete.add(c.id);
            added = true;
          }
        });
      }
      db.comentarios = db.comentarios.filter(c => !idsToDelete.has(c.id));
      await saveDemoDb(db);
      return null;
    }
    case 'POST /curtida/curtir': {
      const idAutor = parseInt(q.get('idAutor')), idPost = parseInt(q.get('idPost'));
      const tipo = (q.get('tipo') || 'like');
      const existing = db.curtidas.find(c => c.autorId === idAutor && c.postId === idPost);
      if (existing) existing.tipo = tipo;
      else db.curtidas.push({ id: db.nextIds.curtida++, autorId: idAutor, postId: idPost, tipo });
      // notifica o dono do post (se não for o próprio)
      const post = db.posts.find(p => p.id === idPost);
      if (post && !existing) criarNotificacao(db, { usuarioId: post.autorId, tipo: 'curtida', deId: idAutor, postId: idPost });
      await saveDemoDb(db);
      return 'Curtido';
    }
    case 'DELETE /curtida/descurtir': {
      const idAutor = parseInt(q.get('idAutor')), idPost = parseInt(q.get('idPost'));
      db.curtidas = db.curtidas.filter(c => !(c.autorId === idAutor && c.postId === idPost));
      await saveDemoDb(db);
      return 'Descurtido';
    }
    case 'GET /curtida/contarCurtidas':
      return db.curtidas.filter(c => c.postId === parseInt(q.get('idPost'))).length;
    case 'GET /curtida/reacoes': {
      const idPost = parseInt(q.get('idPost'));
      const reacoes = db.curtidas.filter(c => c.postId === idPost);
      const porTipo = {};
      reacoes.forEach(r => { porTipo[r.tipo] = (porTipo[r.tipo] || 0) + 1; });
      const idAutor = q.get('idAutor') ? parseInt(q.get('idAutor')) : null;
      const minha = idAutor ? (reacoes.find(r => r.autorId === idAutor) || null) : null;
      return { total: reacoes.length, porTipo, minhaReacao: minha ? minha.tipo : null };
    }
    case 'GET /amizade/status': {
      const a = parseInt(q.get('a')), b = parseInt(q.get('b'));
      return amizadeStatusEntre(db, a, b);
    }
    case 'POST /amizade/solicitar': {
      const solicitanteId = parseInt(q.get('idSolicitante')), destinatarioId = parseInt(q.get('idDestinatario'));
      if (db.amizades.some(a => (a.solicitanteId === solicitanteId && a.destinatarioId === destinatarioId) || (a.solicitanteId === destinatarioId && a.destinatarioId === solicitanteId))) {
        fail('Já existe uma amizade ou solicitação entre vocês.');
      }
      db.amizades.push({ id: db.nextIds.amizade++, solicitanteId, destinatarioId, status: 'pendente' });
      // notifica o destinatário que recebeu solicitação
      criarNotificacao(db, { usuarioId: destinatarioId, tipo: 'amizade_solicitada', deId: solicitanteId });
      await saveDemoDb(db);
      return 'Solicitação enviada';
    }
    case 'PUT /amizade/aceitar': {
      const idx = db.amizades.findIndex(a => a.id === parseInt(q.get('idAmizade')));
      if (idx === -1) fail('Solicitação não encontrada.');
      db.amizades[idx].status = 'aceita';
      // notifica o solicitante que a amizade foi aceita
      criarNotificacao(db, { usuarioId: db.amizades[idx].solicitanteId, tipo: 'amizade_aceita', deId: db.amizades[idx].destinatarioId });
      await saveDemoDb(db);
      return 'Amizade aceita';
    }
    case 'PUT /amizade/recusar': {
      db.amizades = db.amizades.filter(a => a.id !== parseInt(q.get('idAmizade')));
      await saveDemoDb(db);
      return 'Amizade recusada';
    }
    case 'DELETE /amizade/desfazer': {
      db.amizades = db.amizades.filter(a => a.id !== parseInt(q.get('idAmizade')));
      await saveDemoDb(db);
      return 'Amizade desfeita';
    }
    case 'GET /amizade/pendentes':
      return db.amizades
        .filter(a => a.destinatarioId === parseInt(q.get('idUsuario')) && a.status === 'pendente')
        .filter(a => db.users.some(u => u.id === a.solicitanteId) && db.users.some(u => u.id === a.destinatarioId))
        .map(a => demoAmizadeFull(db, a));
    case 'GET /amizade/amigos':
      return db.amizades
        .filter(a => a.status === 'aceita' && (a.solicitanteId === parseInt(q.get('idUsuario')) || a.destinatarioId === parseInt(q.get('idUsuario'))))
        .filter(a => db.users.some(u => u.id === a.solicitanteId) && db.users.some(u => u.id === a.destinatarioId))
        .map(a => demoAmizadeFull(db, a));
    case 'POST /mensagem/enviar': {
      const remetenteId = parseInt(q.get('remetenteId')), destinatarioId = parseInt(q.get('destinatarioId'));
      if (!body || (!body.conteudo && !body.imagem)) fail('Escreva algo ou anexe uma imagem.');
      const msg = { id: db.nextIds.mensagem++, remetenteId, destinatarioId, conteudo: (body.conteudo || '').trim(), imagem: body.imagem || '', replyToId: body.replyToId || null, editado: false, dataCriacao: demoNow() };
      db.mensagens.push(msg);
      // notifica o destinatário
      criarNotificacao(db, { usuarioId: destinatarioId, tipo: 'mensagem', deId: remetenteId, extra: (body.conteudo || '').slice(0, 60) });
      await saveDemoDb(db);
      return demoMensagemFull(db, msg);
    }
    case 'PUT /mensagem/editar': {
      const m = db.mensagens.find(x => x.id === body.id);
      if (!m) fail('Mensagem não encontrada.');
      m.conteudo = body.conteudo || '';
      m.editado = true;
      await saveDemoDb(db);
      return demoMensagemFull(db, m);
    }
    case 'GET /mensagem/conversa': {
      const a = parseInt(q.get('usuarioA')), b = parseInt(q.get('usuarioB'));
      return db.mensagens
        .filter(m => (m.remetenteId === a && m.destinatarioId === b) || (m.remetenteId === b && m.destinatarioId === a))
        .sort((x, y) => new Date(x.dataCriacao) - new Date(y.dataCriacao))
        .map(m => demoMensagemFull(db, m));
    }
    case 'GET /mensagem/conversas': {
      const uid = parseInt(q.get('idUsuario'));
      const otherIds = new Set();
      db.mensagens.forEach(m => {
        if (m.remetenteId === uid) otherIds.add(m.destinatarioId);
        if (m.destinatarioId === uid) otherIds.add(m.remetenteId);
      });
      const list = [...otherIds].map(oid => {
        const msgs = db.mensagens.filter(m => (m.remetenteId === uid && m.destinatarioId === oid) || (m.remetenteId === oid && m.destinatarioId === uid))
          .sort((x, y) => new Date(y.dataCriacao) - new Date(x.dataCriacao));
        return { outro: demoUserPublic(db, oid), ultimaMensagem: msgs[0] ? demoMensagemFull(db, msgs[0]) : null };
      }).filter(x => x.outro && x.ultimaMensagem);
      list.sort((a, b) => new Date(b.ultimaMensagem.dataCriacao) - new Date(a.ultimaMensagem.dataCriacao));
      return list;
    }
    case 'GET /mensagem/todasConversas': {
      const pairs = new Map();
      db.mensagens.forEach(m => {
        const key = [m.remetenteId, m.destinatarioId].sort((x, y) => x - y).join('-');
        const cur = pairs.get(key);
        if (!cur || new Date(m.dataCriacao) > new Date(cur.dataCriacao)) pairs.set(key, m);
      });
      return [...pairs.values()].map(m => ({
        usuarioA: demoUserPublic(db, m.remetenteId),
        usuarioB: demoUserPublic(db, m.destinatarioId),
        ultimaMensagem: demoMensagemFull(db, m),
      })).sort((a, b) => new Date(b.ultimaMensagem.dataCriacao) - new Date(a.ultimaMensagem.dataCriacao));
    }
    case 'DELETE /mensagem/deletar':
      db.mensagens = db.mensagens.filter(m => m.id !== parseInt(q.get('id')));
      await saveDemoDb(db);
      return null;
    case 'GET /perfil/visitantes': {
      const uid = parseInt(q.get('idUsuario'));
      db.visitasPerfil = db.visitasPerfil || {};
      const log = db.visitasPerfil[uid] || [];
      return log.slice(0, 20).map(v => ({ ...v, usuario: demoUserPublic(db, v.usuarioId) })).filter(v => v.usuario);
    }
    case 'GET /achievements/progresso': {
      const uid = parseInt(q.get('idUsuario'));
      const posts = db.posts.filter(p => p.autorId === uid);
      const comentarios = db.comentarios.filter(c => c.autorId === uid);
      const curtidasDadas = db.curtidas.filter(c => c.autorId === uid);
      const curtidasRecebidas = db.curtidas.filter(c => {
        const post = db.posts.find(p => p.id === c.postId);
        return post && post.autorId === uid;
      });
      const amigos = db.amizades.filter(a => a.status === 'aceita' && (a.solicitanteId === uid || a.destinatarioId === uid));
      const imagensPostadas = posts.reduce((n, p) => n + (p.imagens ? p.imagens.length : 0), 0);
      const enquetesCriadas = posts.filter(p => p.enquete).length;
      const grupos = db.grupos.filter(g => g.membros.some(m => m.id === uid && m.status === 'aceito')).length;
      const dmsEnviadas = db.mensagens.filter(m => m.remetenteId === uid).length;
      const user = db.users.find(u => u.id === uid);
      const recadosRecebidos = (db.recados || []).filter(r => r.destinatarioId === uid).length;
      const menacoesRecebidas = db.posts.filter(p => {
        if (p.autorId === uid) return false;
        const re = new RegExp('@' + (user ? user.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''), 'i');
        return re.test(p.conteudo || '');
      }).length + db.comentarios.filter(c => {
        if (c.autorId === uid) return false;
        const re = new RegExp('@' + (user ? user.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''), 'i');
        return re.test(c.conteudo || '');
      }).length;
      return {
        posts: posts.length,
        comentarios: comentarios.length,
        curtidasDadas: curtidasDadas.length,
        curtidasRecebidas: curtidasRecebidas.length,
        amigos: amigos.length,
        imagensPostadas,
        enquetesCriadas,
        grupos,
        dmsEnviadas,
        recadosRecebidos,
        menacoesRecebidas,
        temMood: !!(user && user.mood),
        temTitulo: !!(user && user.titulo),
      };
    }
    // === MOOD / STATUS DE PERSONAGEM ===
    case 'PUT /perfil/atualizarMood': {
      const u = db.users.find(x => x.id === body.idUsuario);
      if (!u) fail('Usuário não encontrado.');
      u.mood = (body.mood || '').slice(0, 60);
      await saveDemoDb(db);
      return { mood: u.mood };
    }
    // === TÍTULO / FLAIR (próprio) ===
    case 'PUT /perfil/atualizarTitulo': {
      const u = db.users.find(x => x.id === body.idUsuario);
      if (!u) fail('Usuário não encontrado.');
      u.titulo = (body.titulo || '').slice(0, 40);
      u.tituloCor = (body.tituloCor || '').slice(0, 20);
      await saveDemoDb(db);
      return { titulo: u.titulo, tituloCor: u.tituloCor };
    }
    // === TÍTULO / FLAIR (admin em outro usuário) ===
    case 'PUT /admin/atualizarTituloUsuario': {
      const admin = db.users.find(x => x.id === body.idAdmin);
      if (!admin || !isAdminAllowed(admin)) fail('Apenas administradores podem fazer isso.');
      const u = db.users.find(x => x.id === body.idUsuario);
      if (!u) fail('Usuário não encontrado.');
      u.adminTitulo = (body.titulo || '').slice(0, 40);
      u.adminTituloCor = (body.tituloCor || '').slice(0, 20);
      await saveDemoDb(db);
      return { adminTitulo: u.adminTitulo, adminTituloCor: u.adminTituloCor };
    }
    // === RECADOS (testimonial público estilo Orkut) ===
    case 'POST /recado/criarRecado': {
      const recado = { id: db.nextIds.recado++, autorId: body.autorId, destinatarioId: body.destinatarioId, conteudo: (body.conteudo || '').slice(0, 500), dataCriacao: demoNow() };
      db.recados.push(recado);
      // notifica o dono do perfil
      criarNotificacao(db, { usuarioId: body.destinatarioId, tipo: 'recado', deId: body.autorId, extra: (body.conteudo || '').slice(0, 60) });
      await saveDemoDb(db);
      return 'Recado enviado';
    }
    case 'GET /recado/listarRecados': {
      const uid = parseInt(q.get('idUsuario'));
      return (db.recados || [])
        .filter(r => r.destinatarioId === uid)
        .filter(r => db.users.some(u => u.id === r.autorId))
        .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
        .map(r => ({ ...r, autor: demoUserPublic(db, r.autorId) }));
    }
    case 'DELETE /recado/deletarRecado': {
      const rid = parseInt(q.get('id'));
      const solicitanteId = parseInt(q.get('idSolicitante'));
      const rec = (db.recados || []).find(r => r.id === rid);
      if (!rec) fail('Recado não encontrado.');
      // autor do recado, dono do perfil, ou admin podem deletar
      const solicitante = db.users.find(u => u.id === solicitanteId);
      const isOwner = rec.autorId === solicitanteId || rec.destinatarioId === solicitanteId;
      const isAdmin = solicitante && isAdminAllowed(solicitante);
      if (!isOwner && !isAdmin) fail('Você não tem permissão para deletar este recado.');
      db.recados = (db.recados || []).filter(r => r.id !== rid);
      await saveDemoDb(db);
      return null;
    }
    // === LEADERBOARD / QUADRO DE POSIÇÃO DE ATIVIDADE ===
    // === NÍVEIS 1-10 ===
    // Calcula nível baseado no score de atividade (XP = score).
    // Nível 1: 0-49, Nível 2: 50-99, ..., Nível 10: 450+ (cada nível = 50 XP)
    function calcularNivel(score) {
      const niveis = [
        { nivel: 1, min: 0 },
        { nivel: 2, min: 50 },
        { nivel: 3, min: 100 },
        { nivel: 4, min: 150 },
        { nivel: 5, min: 200 },
        { nivel: 6, min: 250 },
        { nivel: 7, min: 300 },
        { nivel: 8, min: 350 },
        { nivel: 9, min: 400 },
        { nivel: 10, min: 450 },
      ];
      let atual = niveis[0];
      for (const n of niveis) {
        if (score >= n.min) atual = n;
      }
      const proximo = niveis.find(n => n.nivel === atual.nivel + 1);
      const xpNoNivel = score - atual.min;
      const xpProximoNivel = proximo ? (proximo.min - atual.min) : 0;
      const progresso = proximo ? Math.min(100, Math.round((xpNoNivel / xpProximoNivel) * 100)) : 100;
      return {
        nivel: atual.nivel,
        xp: score,
        xpNoNivel,
        xpProximoNivel,
        progresso,
        nivelMaximo: !proximo,
      };
    }

    // Helper: calcula estatísticas completas de um usuário (posts, comentarios, curtidas, recados, score, nivel)
    function calcularStatsUsuario(db, u) {
      const posts = db.posts.filter(p => p.autorId === u.id).length;
      const comentarios = db.comentarios.filter(c => c.autorId === u.id).length;
      const curtidasDadas = db.curtidas.filter(c => c.autorId === u.id).length;
      const curtidasRecebidas = db.curtidas.filter(c => {
        const post = db.posts.find(p => p.id === c.postId);
        return post && post.autorId === u.id;
      }).length;
      const recados = (db.recados || []).filter(r => r.destinatarioId === u.id).length;
      const score = posts * 5 + comentarios * 2 + curtidasDadas + curtidasRecebidas * 3 + recados * 2;
      const nivelInfo = calcularNivel(score);
      return { posts, comentarios, curtidasDadas, curtidasRecebidas, recados, score, ...nivelInfo };
    }

    case 'GET /leaderboard/atividade': {
      return db.users.map(u => {
        const stats = calcularStatsUsuario(db, u);
        return { id: u.id, nome: u.nome, fotoPerfilUrl: u.fotoPerfilUrl, titulo: u.titulo, adminTitulo: u.adminTitulo, tituloCor: u.tituloCor, adminTituloCor: u.adminTituloCor, isAdmin: isAdminAllowed(u), ...stats };
      }).sort((a, b) => b.score - a.score);
    }
    // === NÍVEL DE UM USUÁRIO ESPECÍFICO ===
    case 'GET /nivel/info': {
      const uid = parseInt(q.get('idUsuario'));
      const u = db.users.find(x => x.id === uid);
      if (!u) return { nivel: 1, xp: 0, progresso: 0, nivelMaximo: false };
      return calcularStatsUsuario(db, u);
    }
    // === ONLINE AGORA: heartbeat e lista de usuários online ===
    case 'PUT /user/heartbeat': {
      const uid = parseInt(body.idUsuario);
      const u = db.users.find(x => x.id === uid);
      if (u) {
        u.ultimaVisto = new Date().toISOString();
        u.status = 'online';
        await saveDemoDb(db);
      }
      return { ok: true };
    }
    case 'GET /user/onlineAgora': {
      const agora = Date.now();
      const LIMITE_ONLINE_MS = 2 * 60 * 1000; // 2 minutos
      return db.users
        .filter(u => {
          if (!u.ultimaVisto) return false;
          return (agora - new Date(u.ultimaVisto).getTime()) < LIMITE_ONLINE_MS;
        })
        .map(u => ({
          id: u.id,
          nome: u.nome,
          fotoPerfilUrl: u.fotoPerfilUrl,
          ultimaVisto: u.ultimaVisto,
        }));
    }
    // === NOTIFICAÇÕES DE MENÇÃO ===
    case 'GET /mention/listar': {
      const uid = parseInt(q.get('idUsuario'));
      const user = db.users.find(u => u.id === uid);
      if (!user) return [];
      const nomeEsc = user.nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp('@' + nomeEsc, 'i');
      const results = [];
      db.posts.forEach(p => {
        if (p.autorId !== uid && re.test(p.conteudo || '')) {
          results.push({ tipo: 'post', id: p.id, postId: p.id, autorId: p.autorId, autor: demoUserPublic(db, p.autorId), conteudo: p.conteudo, dataCriacao: p.dataCriacao });
        }
      });
      db.comentarios.forEach(c => {
        if (c.autorId !== uid && re.test(c.conteudo || '')) {
          results.push({ tipo: 'comentario', id: c.id, postId: c.postId, autorId: c.autorId, autor: demoUserPublic(db, c.autorId), conteudo: c.conteudo, dataCriacao: c.dataCriacao });
        }
      });
      return results.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)).slice(0, 30);
    }
    // === ADMIN: POSTAR COMO SISTEMA (comemoração de marco, anúncios) ===
    case 'POST /admin/postSistema': {
      const admin = db.users.find(x => x.id === body.idAdmin);
      if (!admin || !isAdminAllowed(admin)) fail('Apenas administradores.');
      const imagens = Array.isArray(body.imagens) && body.imagens.length ? body.imagens : [];
      const post = { id: db.nextIds.post++, autorId: body.idAdmin, conteudo: body.conteudo || '', imagem: imagens[0] || '', imagens, enquete: null, repostOf: null, fixado: false, editado: false, isSystem: true, dataCriacao: demoNow() };
      db.posts.push(post);
      await saveDemoDb(db);
      return 'Post do sistema criado';
    }
    // === CIDADE: CLIMA DO DIA (só admin) ===
    case 'PUT /cidade/atualizarClima': {
      const admin = db.users.find(u => u.id === body.idAdmin);
      if (!admin || !isAdminAllowed(admin)) fail('Só a prefeitura pode mudar o clima.');
      const climasValidos = {
        'ensolarado': { icone: '☀️', label: 'ensolarado' },
        'nublado': { icone: '☁️', label: 'nublado' },
        'garoa': { icone: '🌧️', label: 'garoa' },
        'tempestade': { icone: '⛈️', label: 'tempestade' },
        'neblina': { icone: '🌫️', label: 'neblina' },
        'neve': { icone: '❄️', label: 'neve' },
        'ventania': { icone: '💨', label: 'ventania' },
        'calor': { icone: '🥵', label: 'calor escaldante' },
      };
      const cv = climasValidos[body.condicao] || climasValidos['nublado'];
      db.cidade.clima = { condicao: cv.label, temp: parseInt(body.temp) || 20, icone: cv.icone, atualizadoEm: demoNow(), atualizadoPor: body.idAdmin };
      await saveDemoDb(db);
      return db.cidade.clima;
    }
    case 'GET /cidade/estado': {
      return {
        clima: db.cidade.clima,
        horaManual: db.cidade.horaManual,
        radioEstacoes: db.cidade.radioEstacoes,
        radioEstacaoAtiva: db.cidade.radioEstacaoAtiva,
        radioAleatorio: db.cidade.radioAleatorio,
      };
    }
    // === CIDADE: RELÓGIO / HORA DO DIA (só admin muda) ===
    case 'PUT /cidade/atualizarHora': {
      const admin = db.users.find(u => u.id === body.idAdmin);
      if (!admin || !isAdminAllowed(admin)) fail('Só a prefeitura pode mudar a hora.');
      db.cidade.horaManual = body.horaManual === null || body.horaManual === undefined ? null : Math.max(0, Math.min(23, parseInt(body.horaManual)));
      await saveDemoDb(db);
      return { horaManual: db.cidade.horaManual };
    }
    // === CIDADE: RÁDIO LOCKWOOD FM ===
    case 'GET /radio/estado': {
      return {
        estacoes: db.cidade.radioEstacoes,
        estacaoAtiva: db.cidade.radioEstacaoAtiva,
        aleatorio: db.cidade.radioAleatorio,
      };
    }
    case 'PUT /radio/atualizarEstacao': {
      const admin = db.users.find(u => u.id === body.idAdmin);
      if (!admin || !isAdminAllowed(admin)) fail('Só a prefeitura controla a rádio.');
      db.cidade.radioEstacaoAtiva = parseInt(body.estacaoId) || 1;
      await saveDemoDb(db);
      return { estacaoAtiva: db.cidade.radioEstacaoAtiva };
    }
    case 'PUT /radio/toggleAleatorio': {
      const admin = db.users.find(u => u.id === body.idAdmin);
      if (!admin || !isAdminAllowed(admin)) fail('Só a prefeitura controla a rádio.');
      db.cidade.radioAleatorio = !db.cidade.radioAleatorio;
      await saveDemoDb(db);
      return { aleatorio: db.cidade.radioAleatorio };
    }
    case 'PUT /radio/configurarEstacoes': {
      const admin = db.users.find(u => u.id === body.idAdmin);
      if (!admin || !isAdminAllowed(admin)) fail('Só a prefeitura configura as estações.');
      if (Array.isArray(body.estacoes)) {
        body.estacoes.forEach(e => {
          const idx = db.cidade.radioEstacoes.findIndex(es => es.id === e.id);
          if (idx >= 0) {
            db.cidade.radioEstacoes[idx].nome = e.nome || db.cidade.radioEstacoes[idx].nome;
            db.cidade.radioEstacoes[idx].genero = e.genero || db.cidade.radioEstacoes[idx].genero;
            db.cidade.radioEstacoes[idx].playlistUrl = e.playlistUrl !== undefined ? e.playlistUrl : db.cidade.radioEstacoes[idx].playlistUrl;
            db.cidade.radioEstacoes[idx].cor = e.cor || db.cidade.radioEstacoes[idx].cor;
          }
        });
      }
      await saveDemoDb(db);
      return db.cidade.radioEstacoes;
    }
    // === NOTIFICAÇÕES (sino) ===
    case 'GET /notificacao/listar': {
      const uid = parseInt(q.get('idUsuario'));
      const limite = parseInt(q.get('limite')) || 30;
      return (db.notificacoes || [])
        .filter(n => n.usuarioId === uid)
        .sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao))
        .slice(0, limite)
        .map(n => {
          const de = n.deId ? demoUserPublic(db, n.deId) : null;
          return { ...n, de: de ? { id: de.id, nome: de.nome, fotoPerfilUrl: de.fotoPerfilUrl } : null };
        });
    }
    case 'GET /notificacao/contarNaoLidas': {
      const uid = parseInt(q.get('idUsuario'));
      return (db.notificacoes || []).filter(n => n.usuarioId === uid && !n.lida).length;
    }
    case 'PUT /notificacao/marcarLida': {
      const uid = parseInt(q.get('idUsuario')) || (body && parseInt(body.idUsuario));
      const idNotif = body && body.idNotif; // se vier, marca só essa; senão marca todas
      if (idNotif) {
        const n = (db.notificacoes || []).find(x => x.id === idNotif && x.usuarioId === uid);
        if (n) n.lida = true;
      } else {
        (db.notificacoes || []).forEach(n => { if (n.usuarioId === uid) n.lida = true; });
      }
      await saveDemoDb(db);
      return 'ok';
    }
    case 'DELETE /notificacao/limpar': {
      const uid = parseInt(q.get('idUsuario'));
      db.notificacoes = (db.notificacoes || []).filter(n => n.usuarioId !== uid);
      await saveDemoDb(db);
      return 'ok';
    }
    // === LOCKWOOD TIMES (jornal da cidade) ===
    case 'POST /noticia/criarNoticia': {
      const admin = db.users.find(u => u.id === body.autorId);
      if (!admin || !isAdminAllowed(admin)) fail('Só a prefeitura publica no Lockwood Times.');
      const noticia = { id: db.nextIds.noticia++, autorId: body.autorId, manchete: (body.manchete || '').trim(), corpo: (body.corpo || '').trim(), imagem: body.imagem || '', fixado: !!body.fixado, dataCriacao: demoNow() };
      db.noticias.push(noticia);
      await saveDemoDb(db);
      return noticia;
    }
    case 'GET /noticia/listarNoticias': {
      return [...db.noticias].sort((a, b) => {
        if (a.fixado && !b.fixado) return -1;
        if (!a.fixado && b.fixado) return 1;
        return new Date(b.dataCriacao) - new Date(a.dataCriacao);
      }).map(n => {
        const autor = demoUserPublic(db, n.autorId);
        return { ...n, autor, nome: autor ? autor.nome : 'Redação' };
      });
    }
    case 'DELETE /noticia/deletarNoticia': {
      const nid = parseInt(q.get('id'));
      const solicitanteId = parseInt(q.get('idSolicitante'));
      const solicitante = db.users.find(u => u.id === solicitanteId);
      if (!solicitante || !isAdminAllowed(solicitante)) fail('Só a prefeitura pode excluir notícias.');
      db.noticias = db.noticias.filter(n => n.id !== nid);
      db.comentariosNoticia = db.comentariosNoticia.filter(c => c.noticiaId !== nid);
      await saveDemoDb(db);
      return null;
    }
    case 'POST /noticia/comentar': {
      const noticia = db.noticias.find(n => n.id === body.noticiaId);
      if (!noticia) fail('Notícia não encontrada.');
      const comentario = { id: db.nextIds.comentarioNoticia++, noticiaId: body.noticiaId, autorId: body.autorId, conteudo: (body.conteudo || '').trim(), dataCriacao: demoNow() };
      db.comentariosNoticia.push(comentario);
      // notifica o autor da notícia
      criarNotificacao(db, { usuarioId: noticia.autorId, tipo: 'comentario_noticia', deId: body.autorId, noticiaId: body.noticiaId });
      await saveDemoDb(db);
      return comentario;
    }
    case 'GET /noticia/listarComentarios': {
      const nid = parseInt(q.get('noticiaId'));
      return db.comentariosNoticia.filter(c => c.noticiaId === nid).sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao)).map(c => {
        const autor = demoUserPublic(db, c.autorId);
        return { ...c, autor, nome: autor ? autor.nome : 'Morador' };
      });
    }
    // === EVENTOS DA CIDADE ===
    case 'POST /evento/criarEvento': {
      const admin = db.users.find(u => u.id === body.autorId);
      if (!admin || !isAdminAllowed(admin)) fail('Só a prefeitura cria eventos da cidade.');
      const evento = { id: db.nextIds.evento++, autorId: body.autorId, titulo: (body.titulo || '').trim(), descricao: (body.descricao || '').trim(), data: body.data || demoNow(), local: (body.local || '').trim(), dataCriacao: demoNow() };
      db.eventos.push(evento);
      await saveDemoDb(db);
      return evento;
    }
    case 'GET /evento/listarEventos': {
      return [...db.eventos].sort((a, b) => new Date(a.data) - new Date(b.data));
    }
    case 'DELETE /evento/deletarEvento': {
      const eid = parseInt(q.get('id'));
      const solicitanteId = parseInt(q.get('idSolicitante'));
      const solicitante = db.users.find(u => u.id === solicitanteId);
      if (!solicitante || !isAdminAllowed(solicitante)) fail('Só a prefeitura pode excluir eventos.');
      db.eventos = db.eventos.filter(e => e.id !== eid);
      db.rsvps = db.rsvps.filter(r => r.eventoId !== eid);
      await saveDemoDb(db);
      return null;
    }
    case 'POST /evento/responder': {
      const evento = db.eventos.find(e => e.id === body.eventoId);
      if (!evento) fail('Evento não encontrado.');
      const status = ['vou', 'talvez', 'nao'].includes(body.status) ? body.status : 'talvez';
      let rsvp = db.rsvps.find(r => r.eventoId === body.eventoId && r.usuarioId === body.usuarioId);
      let eraNovo = false;
      if (rsvp) {
        rsvp.status = status;
        rsvp.dataResposta = demoNow();
      } else {
        eraNovo = true;
        rsvp = { id: db.nextIds.rsvp++, eventoId: body.eventoId, usuarioId: body.usuarioId, status, dataResposta: demoNow() };
        db.rsvps.push(rsvp);
      }
      // notifica o autor do evento só no primeiro RSVP (pra não floodar)
      if (eraNovo) criarNotificacao(db, { usuarioId: evento.autorId, tipo: 'rsvp', deId: body.usuarioId, eventoId: body.eventoId, extra: status });
      await saveDemoDb(db);
      return rsvp;
    }
    case 'GET /evento/listarRespostas': {
      const eid = parseInt(q.get('eventoId'));
      const lista = db.rsvps.filter(r => r.eventoId === eid).map(r => {
        const u = db.users.find(x => x.id === r.usuarioId);
        return { id: r.id, usuarioId: r.usuarioId, status: r.status, nome: u ? u.nome : '??', fotoPerfilUrl: u ? u.fotoPerfilUrl : '' };
      });
      return lista;
    }
    default:
      fail(`Rota de demonstração não implementada: ${key}`);
  }
}

// ===== SERVIDOR HTTP =====
const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, 'http://localhost:' + (process.env.PORT || 3000));
  const pathname = url.pathname;

  // Serve index.html at root
  if (pathname === '/' || pathname === '/index.html') {
    try {
      const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (e) {
      res.writeHead(500);
      res.end('Erro ao carregar index.html');
    }
    return;
  }

  // Rota de status do banco (monitorar tamanho / saúde)
  if (pathname === '/status') {
    try {
      const db = await loadDemoDb();
      const jsonStr = JSON.stringify(db);
      const sizeBytes = Buffer.byteLength(jsonStr, 'utf8');
      const sizeKB = (sizeBytes / 1024).toFixed(1);
      const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);
      const status = {
        ok: true,
        bancoTamanhoBytes: sizeBytes,
        bancoTamanhoKB: sizeKB,
        bancoTamanhoMB: sizeMB,
        backupGithubAtivo: GITHUB_BACKUP_ATIVO,
        limiteAlertaKB: 50000, // avisa se passar de ~50MB (limite soft do GitHub)
        estatisticas: {
          usuarios: (db.users || []).length,
          posts: (db.posts || []).length,
          comentarios: (db.comentarios || []).length,
          curtidas: (db.curtidas || []).length,
          amizades: (db.amizades || []).length,
          mensagens: (db.mensagens || []).length,
          grupos: (db.grupos || []).length,
          mensagensGrupo: (db.mensagensGrupo || []).length,
          noticias: (db.noticias || []).length,
          eventos: (db.eventos || []).length,
          recados: (db.recados || []).length,
        },
        aviso: sizeBytes > 50 * 1024 * 1024 ? 'BANCO GRANDE (>50MB) — considere limpeza' : 'tudo certo',
      };
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(status, null, 2));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, erro: e.message }));
    }
    return;
  }

  // API routes
  if (pathname.startsWith('/')) {
    let body = null;
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw) {
        try { body = JSON.parse(raw); } catch (e) { body = null; }
      }
    }

    // Build the path with query string for mockApi
    const fullPath = pathname + (url.search || '');

    try {
      const result = await mockApi(fullPath, { method: req.method, body });
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ message: e.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🌆 Lockwood.net servidor rodando na porta ' + PORT);
  console.log('   Acesse: http://localhost:' + PORT);
});

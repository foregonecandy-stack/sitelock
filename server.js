const http = require('http');
const fs = require('fs');
const path = require('path');

// ===== LÓGICA DO BANCO (extraída do index.html) =====
const ADMIN_EMAILS = ['ana@lockwood.net', 'bot@lockwood.net'];
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
      { id: 1, email: 'ana@lockwood.net', senha: '123456', nome: 'Ana Beatriz', bio: 'vivendo, postando, existindo ✨', linkMusica: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', fotoPerfilUrl: '', bannerUrl: '', amigosPersonalizado: null, desdePersonalizado: null, mood: 'inquietamente viva ✨', titulo: 'Moradora fundadora', tituloCor: '#ff5470', adminTitulo: '', adminTituloCor: '', dataCriacao: new Date(now - 20 * 86400000).toISOString() },
      { id: 2, email: 'bot@lockwood.net', senha: '123456', nome: 'Lockwood Bot', bio: 'perfil oficial da casa 🤖', linkMusica: '', fotoPerfilUrl: '', bannerUrl: '', amigosPersonalizado: null, desdePersonalizado: null, mood: 'online e vigilante 🤖', titulo: 'Admin & Bot', tituloCor: '#00e5ff', adminTitulo: '', adminTituloCor: '', dataCriacao: new Date(now - 40 * 86400000).toISOString() },
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


// ===== ARMAZENAMENTO EM ARQUIVO (substitui IndexedDB) =====
const DB_FILE = path.join(__dirname, 'lockwood_db.json');
let _dbCache = null;

async function loadDemoDb() {
  if (_dbCache) return _dbCache;
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      _dbCache = migrateDemoDb(parsed);
      return _dbCache;
    }
  } catch (e) {
    console.error('Erro ao ler DB:', e.message);
  }
  // Primeiro uso: cria o seed
  _dbCache = migrateDemoDb(seedDemoDb());
  saveDemoDb(_dbCache);
  return _dbCache;
}

async function saveDemoDb(db) {
  _dbCache = db;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('Erro ao salvar DB:', e.message);
  }
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
      const user = { id: db.nextIds.user++, email: body.email, senha: body.senha, nome: body.nome, bio: '', linkMusica: '', fotoPerfilUrl: '', bannerUrl: '', amigosPersonalizado: null, desdePersonalizado: null, mood: '', titulo: '', tituloCor: '', adminTitulo: '', adminTituloCor: '', dataCriacao: demoNow() };
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
      return user;
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
      const grupo = { id: db.nextIds.grupo++, nome: body.nome, criadorId: body.criadorId, membros, dataCriacao: demoNow() };
      db.grupos.push(grupo);
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
      await saveDemoDb(db);
      return 'Solicitação enviada';
    }
    case 'PUT /amizade/aceitar': {
      const idx = db.amizades.findIndex(a => a.id === parseInt(q.get('idAmizade')));
      if (idx === -1) fail('Solicitação não encontrada.');
      db.amizades[idx].status = 'aceita';
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
      return db.amizades.filter(a => a.destinatarioId === parseInt(q.get('idUsuario')) && a.status === 'pendente').map(a => demoAmizadeFull(db, a));
    case 'GET /amizade/amigos':
      return db.amizades.filter(a => a.status === 'aceita' && (a.solicitanteId === parseInt(q.get('idUsuario')) || a.destinatarioId === parseInt(q.get('idUsuario')))).map(a => demoAmizadeFull(db, a));
    case 'POST /mensagem/enviar': {
      const remetenteId = parseInt(q.get('remetenteId')), destinatarioId = parseInt(q.get('destinatarioId'));
      if (!body || (!body.conteudo && !body.imagem)) fail('Escreva algo ou anexe uma imagem.');
      const msg = { id: db.nextIds.mensagem++, remetenteId, destinatarioId, conteudo: (body.conteudo || '').trim(), imagem: body.imagem || '', replyToId: body.replyToId || null, editado: false, dataCriacao: demoNow() };
      db.mensagens.push(msg);
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
      await saveDemoDb(db);
      return 'Recado enviado';
    }
    case 'GET /recado/listarRecados': {
      const uid = parseInt(q.get('idUsuario'));
      return (db.recados || [])
        .filter(r => r.destinatarioId === uid)
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
    case 'GET /leaderboard/atividade': {
      return db.users.map(u => {
        const posts = db.posts.filter(p => p.autorId === u.id).length;
        const comentarios = db.comentarios.filter(c => c.autorId === u.id).length;
        const curtidasDadas = db.curtidas.filter(c => c.autorId === u.id).length;
        const curtidasRecebidas = db.curtidas.filter(c => {
          const post = db.posts.find(p => p.id === c.postId);
          return post && post.autorId === u.id;
        }).length;
        const recados = (db.recados || []).filter(r => r.destinatarioId === u.id).length;
        const score = posts * 5 + comentarios * 2 + curtidasDadas + curtidasRecebidas * 3 + recados * 2;
        return { id: u.id, nome: u.nome, fotoPerfilUrl: u.fotoPerfilUrl, titulo: u.titulo, adminTitulo: u.adminTitulo, tituloCor: u.tituloCor, adminTituloCor: u.adminTituloCor, isAdmin: isAdminAllowed(u), posts, comentarios, curtidasDadas, curtidasRecebidas, recados, score };
      }).sort((a, b) => b.score - a.score);
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
      if (rsvp) {
        rsvp.status = status;
        rsvp.dataResposta = demoNow();
      } else {
        rsvp = { id: db.nextIds.rsvp++, eventoId: body.eventoId, usuarioId: body.usuarioId, status, dataResposta: demoNow() };
        db.rsvps.push(rsvp);
      }
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

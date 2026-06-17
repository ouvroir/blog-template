# Roadmap

Page de liste de blogs par auteur

- [ ] Rendre optionnelle la génération de biblio
- [ ] Génériciser les fonctions load pour ne pas avoir trop de dépendances, chemin, etc.
- [ ] Rendre la contrainte sur les métadonnées un peu moins forte, renvoyer des mssg explicites
- [ ] Permettre les entiers dans les tags ?

- [ ] Unifier le traitement des tags pour pouvoir ajouter d’autres ressources (il reste à génériciser la base pour la carte )
- [ ] Avoir un parseur Zotero (faire une dépendance ?)

Pb de crawling

<section class="postsList">
    <header>
        <p>
            <a href="/blogs/">← Retour aux articles</a>
        </p>
        <h1>Articles de @nom</h1>
    </header>
    <article class="postCard">
        <header>
            <h2>post-title</h2>
            <dl>
                <dt>Auteur</dt>
                <dd><a rel="author" href="xxx">@nom</a></dd>
                <dt>Date</dt>
                <dd><time datetime="">date</time></dd>
                <dt>Temps de lecture</dt>
                <dd>temps de lecture</dd>
                <dt>Étiquettes</dt>
                <dd>
                    <ul class="tags">
                        <li><a href="tag1">tag1</a></li>
                        <li><a href="tag2">tag2</a></li>
                    </ul>
                    </dd>
                </dl>
        </header>
        <div>
            <p>résumé</p>
        </div>
        <p><a href="eee">Lire la suite →</a></p>
    </article>
</section>

<style>
.postCard {
    position: relative;
}

.stretchedLink::after {
  content: "";
  position: absolute;
  inset: 0;
}

.postCard a:not(.stretchedLink) {
  position: relative;
  z-index: 1;
}

.postCard:focus-within {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
</style>

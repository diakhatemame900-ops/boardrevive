document.addEventListener('DOMContentLoaded', () => {
  const contentWrapper = document.getElementById('content-wrapper');
  const themeToggle = document.getElementById('themeToggle');
  const defaultCallNumber = '767228512';
  
  // *** Sauvegarde du contenu initial de MAIN (inclut la section #privacy) ***
  const initialContent = contentWrapper.innerHTML;

  // ----------------------------------------------------
  // 1. GESTION DU MODE SOMBRE
  // ----------------------------------------------------

  // Fonction pour appliquer le thème
  function applyTheme(theme) {
    const isDarkMode = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = isDarkMode ? 
        // Soleil
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' : 
        // Lune
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'; 
  }

  // Initialisation du thème au chargement de la page
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Écouteur pour le basculement manuel
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  });
  
  // ----------------------------------------------------
  // 2. LOGIQUE DE NAVIGATION ET ALERTE
  // ----------------------------------------------------

  // Gestion de l'affichage/masquage de la politique de confidentialité
  const privacySection = document.getElementById('privacy');
  const privacyLink = document.querySelector('.privacy-link');
  
  // Le contenu de la politique de confidentialité est chargé dans le DOM initial.
  if (privacyLink && privacySection) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      privacySection.classList.toggle('hidden');
      if (!privacySection.classList.contains('hidden')) {
          privacySection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Fonction utilitaire pour remplacer l'alerte native par un modal
  function customAlert(message) {
      const modalId = 'customAlertModal';
      let modal = document.getElementById(modalId);

      if (!modal) {
          modal = document.createElement('div');
          modal.id = modalId;
          modal.style.transition = 'opacity 0.3s ease';
          modal.style.zIndex = '1000';
          modal.style.position = 'fixed';
          modal.style.top = '0';
          modal.style.left = '0';
          modal.style.width = '100%';
          modal.style.height = '100%';
          modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
          modal.style.display = 'none';

          modal.innerHTML = `
              <div style="background-color: var(--bg-secondary); color: var(--text-color-primary); padding: 25px; border-radius: 10px; max-width: 400px; width: 90%; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transition: background-color 0.3s;">
                  <h3 style="font-size: 1.25rem; font-weight: bold; color: #ff6a1c; margin-bottom: 15px;">Information</h3>
                  <p id="alertMessage" style="color: var(--text-color-primary); margin-bottom: 20px;"></p>
                  <div style="text-align: right;">
                      <button id="alertCloseBtn" style="background: #ff6a1c; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">
                          OK
                      </button>
                  </div>
              </div>
          `;
          document.body.appendChild(modal);

          document.getElementById('alertCloseBtn').addEventListener('click', () => {
              modal.style.opacity = '0';
              setTimeout(() => modal.style.display = 'none', 300);
          });
      }
      
      // Mettre à jour le style du modal pour qu'il suive le thème
      const isDarkMode = document.body.classList.contains('dark-mode');
      const modalContent = modal.querySelector('div');
      modalContent.style.backgroundColor = isDarkMode ? '#1e1e1e' : 'white';
      document.getElementById('alertMessage').style.color = isDarkMode ? '#f5f5f9' : '#444';


      document.getElementById('alertMessage').innerHTML = message;
      modal.style.display = 'flex';
      setTimeout(() => modal.style.opacity = '1', 10); // Lancement de la transition
  }

  // Fonction pour gérer le clic du bouton Appel (affiche le modal)
  function showContactModal(e) {
      e.preventDefault();
      // Le lien devient cliquable pour lancer l'appel directement sur le téléphone
      const message = `Pour nous appeler, veuillez cliquer sur le lien ci-dessous ou composer : <br><br><strong><a href="tel:${defaultCallNumber}" style="color: #63d4f5; text-decoration: underline;">${defaultCallNumber}</a></strong>`;
      customAlert(message);
  }

  // Génère les boutons de contact (Appel via Modal / WhatsApp direct)
  const contactButtons = () => `
    <div class="contact-btns">
      <a href="#" class="call-btn contact-call-link">Appel</a> 
      <a href="https://wa.me/221${defaultCallNumber}" target="_blank" class="whatsapp-btn">WhatsApp</a>
    </div>
  `;

  // Utilisation d'une fonction pour attacher les écouteurs sur le contenu dynamique
  function attachListeners() {
    const startBtn = document.getElementById('startBtn');
    const telBtn = document.getElementById('telBtn');
    const pcBtn = document.getElementById('pcBtn');
    
    // Attache la fonction modale à tous les liens d'appel générés dynamiquement
    document.querySelectorAll('.contact-call-link').forEach(link => {
        link.removeEventListener('click', showContactModal);
        link.addEventListener('click', showContactModal);
    });
    

    // Clic sur le bouton "Commencer" (Stage 1 -> Stage 2: Catégories)
    if (startBtn) {
        startBtn.addEventListener('click', () => {
          contentWrapper.innerHTML = `
            <section style="text-align: center;">
              <h2>Choisissez une catégorie</h2>
              <div class="buttons">
                <button id='telBtn'>📱 Téléphone</button><br><br>
                <button id='pcBtn'>💻 PC & Console</button>
              </div>
            </section>
            <!-- Boutons de contact ajoutés sur l'écran de catégorie -->
            <section style="text-align: center; padding: 15px 25px; border: none; box-shadow: none; background: none;">
              <h3 style="color: var(--text-color-primary); font-size: 1.1rem; margin-bottom: 10px;">Contactez-nous directement</h3>
              ${contactButtons()}
            </section>
            <p style="text-align:center; margin-top: -10px;">
                <a href="#" id="backHomeLink" class="back-link">← Retour à l'accueil</a>
            </p>
          `;
          attachListeners(); // Rétache les écouteurs sur les nouveaux boutons
        });
    }
    
    // Clic sur le bouton "Téléphone" (Stage 2 -> Stage 3: Téléphone)
    if (telBtn) {
        telBtn.addEventListener('click', () => {
          contentWrapper.innerHTML = `
            <section>
              <h2>Réparations Téléphones</h2>
              <ul>
                <li>
                  <strong>Remplacement écran Iphone - Android</strong>
                  <span class="detail-tag">Selon le modèle</span>
                  <span class='price-tag'>10 000 – 90 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Remplacement batterie IPhone - Android</strong>
                  <span class='price-tag'>5 000 – 20 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Connecteur de charge</strong>
                  <span class='price-tag'>2 000 – 10 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Réparation carte mère (micro-soudure)</strong>
                  <span class="detail-tag">Diagnostic nécessaire</span>
                  <span class='price-tag'>15 000 – 80 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Désoxydation après liquide</strong>
                  <span class="detail-tag">Nettoyage & test</span>
                  <span class='price-tag'>25 000 – 50 000 FCFA</span>
                  ${contactButtons()}
                </li>
              </ul>
              <p style="text-align:center;">
                  <a href="#" id="backCategoryLink" class="back-link">← Revenir aux catégories</a>
              </p>
            </section>
          `;
          attachListeners();
        });
    }

    // Clic sur le bouton "PC & Console" (Stage 2 -> Stage 4: PC & Console)
    if (pcBtn) {
        pcBtn.addEventListener('click', () => {
          contentWrapper.innerHTML = `
            <section>
              <h2>Réparations PC & Consoles</h2>
              <ul>
                <li>
                  <strong>Remplacement écran (PC / MacBook)</strong>
                  <span class="detail-tag">Selon le modèle</span>
                  <span class='price-tag'>30 000 – 120 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Réinstallation système / optimisation</strong>
                  <span class='price-tag'>15 000 – 25 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Changement SSD + clonage</strong>
                  <span class='price-tag'>15 000 – 80 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Réparation carte mère (micro-soudure)</strong>
                  <span class='price-tag'>30 000 – 150 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Programmation bios</strong>
                  <span class='price-tag'>25 000 – 50 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Remplacement HDMI (PS4/PS5)</strong>
                  <span class='price-tag'>35 000 – 55 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Réparation alimentation (Xbox)</strong>
                  <span class='price-tag'>40 000 – 65 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Nettoyage + pâte thermique</strong>
                  <span class='price-tag'>10 000 – 20 000 FCFA</span>
                  ${contactButtons()}
                </li>
                <li>
                  <strong>Diagnostic complet</strong>
                  <span class='price-tag'>5 000 – 15 000 FCFA</span>
                  ${contactButtons()}
                </li>
              </ul>
              <p style="text-align:center;">
                <a href="#" id="backCategoryLink" class="back-link">← Revenir aux catégories</a>
              </p>
            </section>
          `;
          attachListeners();
        });
    }
    
    // Gestion du bouton "Retour à l'accueil" (depuis les catégories)
    const backHomeLink = document.getElementById('backHomeLink');
    if (backHomeLink) {
        backHomeLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Restaure le contenu initial
            contentWrapper.innerHTML = initialContent;
            
            // Assure que la politique de confidentialité est masquée à nouveau (elle est bien présente dans le DOM)
            const privacySection = document.getElementById('privacy');
            if (privacySection) privacySection.classList.add('hidden'); 

            attachListeners(); // Rétache les écouteurs sur le contenu restauré
        });
    }

    // Gestion du bouton "Revenir aux catégories" (depuis les listes de réparations)
    const backCategoryLink = document.getElementById('backCategoryLink');
    if (backCategoryLink) {
        backCategoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Afficher l'étape des catégories
            contentWrapper.innerHTML = `
                <section style="text-align: center;">
                    <h2>Choisissez une catégorie</h2>
                    <div class="buttons">
                        <button id='telBtn'>📱 Téléphone</button><br><br>
                        <button id='pcBtn'>💻 PC & Console</button>
                    </div>
                </section>
                <!-- Boutons de contact ajoutés sur l'écran de catégorie -->
                <section style="text-align: center; padding: 15px 25px; border: none; box-shadow: none; background: none;">
                  <h3 style="color: var(--text-color-primary); font-size: 1.1rem; margin-bottom: 10px;">Contactez-nous directement</h3>
                  ${contactButtons()}
                </section>
                <p style="text-align:center; margin-top: -10px;">
                    <a href="#" id="backHomeLink" class="back-link">← Retour à l'accueil</a>
                </p>
            `;
            attachListeners();
        });
    }
  }

  // Lance l'écouteur au chargement initial
  attachListeners();
});

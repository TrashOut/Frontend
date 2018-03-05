var i18nLoadLanguages = function (lng) {
  if (lng === 'cs') {
    i18n.translator.add({
      values: {
        'Status of trash': 'Stav skládky',
        'Date of last update': 'Poslední aktualizace',
        'Size of trash': 'Velikost skládky',
        'Type of trash': 'Typ skládky',
        'Reported': 'Nahlášeno',
        'Cleaned': 'Vyčištěno',
        'Update Needed': 'Potřeba aktualizovat',
        'No limit': 'Bez limitu',
        'Last Year': 'Poslední rok',
        'Last Month': 'Poslední měsíc',
        'Last Week': 'Poslední týden',
        'Today': 'Dnes',
        'fits a bag': 'batoh',
        'bag': 'batoh',
        'fits<br>a wheelbarrow': 'kolečko',
        'wheelbarrow': 'kolečko',
        'car needed': 'auto',
        'car': 'auto',
        'household': 'domovní',
        'domestic': 'domovní',
        'automotive': 'auto',
        'construction': 'konstrukce',
        'plastic': 'plasty',
        'electronic': 'elektronika',
        'glass': 'sklo',
        'metal': 'kov',
        'liquid': 'kapaliny',
        'dangerous': 'nebezpečné',
        'dead animals': 'mrtvá zvířata',
        'deadAnimals': 'mrtvá zvířata',
        'Accuracy of location:': 'Přesnost zaměření skládky:',
        'Update this dumpsite': 'Aktualizuj tuto skládku',
        'Take some pictures of this place': 'Pořid fotky skládky',
        'It\'s cleaned': 'Skládka byla vyčištěna',
        'It\'s still here': 'Skládka je stále tady',
        'Reported': 'Reportováno',
        // Accessibility
        'Accessibility': 'Přístupnost',
        'byCar': 'Autem',
        'inCave': 'V jeskyni',
        'notForGeneralCleanup': 'Není určeno pro klasické čištění',
        'underWater': 'Pod vodou',
        'Directions': 'Navigovat na místo',
        // Cleaning Event
        'Help Us To Clean It!': 'Pomoz nám to vyčistit!',
        'Cleaning Event': 'Čistící akce',
        'Join': 'Přidat se',
        'Detail': 'Detail',
      }
    });
  } else {
    console.log(lng);
  }
};
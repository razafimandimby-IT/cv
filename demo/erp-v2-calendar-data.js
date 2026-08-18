(() => {
  'use strict';

  const NS = window.ERP_DEMO_V2;
  if (!NS?.calendarEvents || !NS?.leaveRequests) return;

  const extraEvents = [
    {id:'EV-D101',date:'2026-08-03',title:'Réunion de coordination RH',type:'meeting',time:'08:30',location:'Salle Direction'},
    {id:'EV-D102',date:'2026-08-04',title:'Contrôle sauvegardes hebdomadaire',type:'maintenance',time:'17:30',location:'Infrastructure IT'},
    {id:'EV-D103',date:'2026-08-06',title:'Point pipeline commercial',type:'review',time:'10:00',location:'Salle Commerciale'},
    {id:'EV-D104',date:'2026-08-07',title:'Revue fournisseurs critiques',type:'review',time:'14:30',location:'Achats'},
    {id:'EV-D105',date:'2026-08-11',title:'Atelier sécurité des accès',type:'meeting',time:'09:30',location:'Salle IT'},
    {id:'EV-D106',date:'2026-08-12',title:'Maintenance préventive réseau',type:'maintenance',time:'18:00',location:'Datacenter'},
    {id:'EV-D107',date:'2026-08-13',title:'Comité qualité HelpDesk',type:'review',time:'11:00',location:'Support IT'},
    {id:'EV-D108',date:'2026-08-15',title:'Contrôle stock consommables',type:'inventory',time:'08:30',location:'Magasin central'},
    {id:'EV-D109',date:'2026-08-17',title:'Réunion planning équipes',type:'meeting',time:'09:00',location:'Salle Opérations'},
    {id:'EV-D110',date:'2026-08-18',title:'Revue des demandes de congé',type:'review',time:'11:30',location:'Ressources humaines'},
    {id:'EV-D111',date:'2026-08-19',title:'Synchronisation CRM / Direction',type:'meeting',time:'14:00',location:'Direction commerciale'},
    {id:'EV-D112',date:'2026-08-20',title:'Contrôle licences logicielles',type:'inventory',time:'10:00',location:'Parc IT'},
    {id:'EV-D113',date:'2026-08-22',title:'Test restauration sauvegarde',type:'maintenance',time:'09:00',location:'Infrastructure IT'},
    {id:'EV-D114',date:'2026-08-25',title:'Réception commande matériel IT',type:'inventory',time:'08:45',location:'Tana Central'},
    {id:'EV-D115',date:'2026-08-26',title:'Comité de pilotage ERP',type:'review',time:'10:30',location:'Direction générale'},
    {id:'EV-D116',date:'2026-08-27',title:'Session onboarding nouveaux collaborateurs',type:'meeting',time:'13:30',location:'Salle Formation'},
    {id:'EV-D117',date:'2026-08-29',title:'Maintenance postes utilisateurs',type:'maintenance',time:'08:00',location:'Siège Antananarivo'},
    {id:'EV-D118',date:'2026-08-31',title:'Clôture opérationnelle du mois',type:'review',time:'16:00',location:'Direction'},
    {id:'EV-D119',date:'2026-09-01',title:'Lancement planning septembre',type:'meeting',time:'09:00',location:'Salle Opérations'},
    {id:'EV-D120',date:'2026-09-03',title:'Inventaire parc informatique',type:'inventory',time:'09:30',location:'Parc IT'}
  ];

  const extraLeaves = [
    {id:'LV-D301',who:'Aina Rakoto',type:'Congé annuel',start:'2026-08-06',end:'2026-08-07',days:2,status:'approved',balance:'18,5 j'},
    {id:'LV-D302',who:'Noro Rasoanaivo',type:'Permission',start:'2026-08-12',end:'2026-08-12',days:.5,status:'approved',balance:'12 j'},
    {id:'LV-D303',who:'Tiana Raveloson',type:'Congé annuel',start:'2026-08-24',end:'2026-08-25',days:2,status:'pending',balance:'11,5 j'},
    {id:'LV-D304',who:'Miora Andrianina',type:'Permission exceptionnelle',start:'2026-08-26',end:'2026-08-26',days:1,status:'approved',balance:'12 j'},
    {id:'LV-D305',who:'Hery Randria',type:'Congé annuel',start:'2026-08-27',end:'2026-08-28',days:2,status:'approved',balance:'7 j'},
    {id:'LV-D306',who:'Fara Ramanantsoa',type:'Permission',start:'2026-08-31',end:'2026-08-31',days:.5,status:'pending',balance:'16 j'},
    {id:'LV-D307',who:'Noro Rasoanaivo',type:'Congé annuel',start:'2026-09-02',end:'2026-09-04',days:3,status:'approved',balance:'9 j'},
    {id:'LV-D308',who:'Aina Rakoto',type:'Permission',start:'2026-08-13',end:'2026-08-13',days:.5,status:'rejected',balance:'18,5 j'}
  ];

  const leaveCalendarEvents = [
    {id:'LV-D301-06',date:'2026-08-06',title:'Congé · Aina Rakoto',type:'leave',time:'Toute la journée',location:'RH',status:'approved'},
    {id:'LV-D301-07',date:'2026-08-07',title:'Congé · Aina Rakoto',type:'leave',time:'Toute la journée',location:'RH',status:'approved'},
    {id:'LV-D302-12',date:'2026-08-12',title:'Permission · Noro Rasoanaivo',type:'leave',time:'Après-midi',location:'RH',status:'approved'},
    {id:'LV-D303-24',date:'2026-08-24',title:'Demande congé · Tiana Raveloson',type:'leave',time:'En attente',location:'RH',status:'pending'},
    {id:'LV-D303-25',date:'2026-08-25',title:'Demande congé · Tiana Raveloson',type:'leave',time:'En attente',location:'RH',status:'pending'},
    {id:'LV-D304-26',date:'2026-08-26',title:'Permission · Miora Andrianina',type:'leave',time:'Toute la journée',location:'RH',status:'approved'},
    {id:'LV-D305-27',date:'2026-08-27',title:'Congé · Hery Randria',type:'leave',time:'Toute la journée',location:'RH',status:'approved'},
    {id:'LV-D305-28',date:'2026-08-28',title:'Congé · Hery Randria',type:'leave',time:'Toute la journée',location:'RH',status:'approved'},
    {id:'LV-D306-31',date:'2026-08-31',title:'Demande permission · Fara Ramanantsoa',type:'leave',time:'Matin',location:'RH',status:'pending'},
    {id:'LV-D307-02',date:'2026-09-02',title:'Congé · Noro Rasoanaivo',type:'leave',time:'Toute la journée',location:'RH',status:'approved'},
    {id:'LV-D307-03',date:'2026-09-03',title:'Congé · Noro Rasoanaivo',type:'leave',time:'Toute la journée',location:'RH',status:'approved'},
    {id:'LV-D307-04',date:'2026-09-04',title:'Congé · Noro Rasoanaivo',type:'leave',time:'Toute la journée',location:'RH',status:'approved'}
  ];

  [...extraEvents, ...leaveCalendarEvents].forEach(item => {
    if (!NS.calendarEvents.some(existing => existing.id === item.id)) NS.calendarEvents.push(item);
  });
  extraLeaves.forEach(item => {
    if (!NS.leaveRequests.some(existing => existing.id === item.id)) NS.leaveRequests.push(item);
  });

  NS.calendarEvents.sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
})();

/*

	scripte 2010
	---------------------

	@file 		thias.js
	@version 	1.0
	@date 		2010-10-12
	@author 	Matthias Edler-Golla <meg@wachenfeld-golla.de>

	Copyright (c) 2010 Wachenfeld + Golla, Buero fuer Gestaltung <http://wachenfeld-golla.de>

*/

$(function(){
	$('html').addClass('jsAktiv');
});

$(function(){
	//article erst mal ausblenden
	$('article:not(:first)').hide();
	$('article:first').addClass('sichtbar');
	
	// hier eintragen, bei welchen Elementen NICHT der naechste artikel angezeigt werden soll
	$('body a, body div#index, body p#back, form, video, audio').click(function(e){e.stopPropagation();});
	
	// stefan hatte hier stehen: $(document).bind('click',function(e){
	// das ging NICHT auf iPhone/iPad: präsentation lief nicht weiter!
	$('article').bind('click',function(e){
		weiterGehen()
	});
	
	$(document).keydown(function(event) {
		
		//var taste = event.keyCode;
		//alert (taste);
		
		var aktuelleArtikelNummer = aktuelleArtikelNummerFinden();
		var artikelAnzahl = $('div#wrap article').length;
		
		if (event.keyCode == '39') { //rechts = weiter
			weiterGehen()
		}
		
		if (event.keyCode == '37') { //links = zurueck
			zurueckGehen();
		}
		
		if (event.keyCode == '32') { // Space
			$('div#inhaltsangabe').toggle('fast');
			return false;
		}
		
		if (event.keyCode == '48') { // Null
			$('article:not(:first)').hide().removeClass('sichtbar');
			$('article:first').fadeIn(600).addClass('sichtbar');
			warnungVerbergen();
			aktuelleArtikelNummerEintragen();
		}
		
		// fuegt dem gerade sichtbaren article die Klasse "pointerCursor" hinzu oder wieder weg
		// wenn "pointerCursor" aktiv ist, wird bei den Webkit-Browsern ein großer Pfeil als Cursor sichtbar
		// mit dem man gut deuten kann - dieser wird via CSS eingefuegt!
		if (event.keyCode == '67') { // C
			var c = $('article').attr('class');
			//alert (c);
			if (c.indexOf('pointerCursor')!=-1){
				$('article.sichtbar').removeClass('pointerCursor');
			} else {
				$('article.sichtbar').addClass('pointerCursor');
			}
		}
	});

});

function ArtikelAustauschen(bisherArtikel, neuArtikel){
	$(bisherArtikel).hide().removeClass('sichtbar');
	$(neuArtikel).fadeIn(600).addClass('sichtbar');
}

//sucht alle h1 aus den articles und fuegt diese bei der inhaltsangabe ein
$(function(){
	$('article h1').clone().appendTo('div#inhaltsangabe');
	
	$('div#inhaltsangabe h1').each(function(index){
   		$(this).wrap('<a href="#A_' + ((index-1)+1) + '" title="Springt zum jeweiligen Artikel"><\/a>');
   	});
   	
   	// fuegt jedem article im div#wrap eine eigene id hinzu
	// damit diese dann als ziel verwendet werden koennen
   	$('div#wrap article').each(function(index){
   		$(this).attr({
   			id: 'A_' + ((index-1)+1)
   		});	
   	});
   	
   	// wieviele Artikel = Seiten enthält das Dokument?
   	var artikelAnzahl = ($('div#wrap article').length)-1;
   //	alert (artikelAnzahl);
   	$('h2#Seitenanzeige strong').text(artikelAnzahl);
   	
   	// wenn es sehr viele Artikel gibt, wird in der Inhaltsangabe der vertikale Abstand zwischen den Zeilen verringert
   	// wird via CSS gemacht
   	if (artikelAnzahl >= 15){
   		$('div#inhaltsangabe').addClass('vieleEintraege');
   	}
   	
   	aktuelleArtikelNummerEintragen();
});

// zeigt an, welcher Artikel gerade sichtbar ist
function aktuelleArtikelNummerEintragen(){
   	var aktuelleArtikelNummer = aktuelleArtikelNummerFinden();
   	//alert (aktuelleArtikelNummer);
   	
   	$('h2#Seitenanzeige span').text(aktuelleArtikelNummer);
   	
   	aktivenArtikelMarkieren(aktuelleArtikelNummer);
   	
   	zurueckButtonAusblenden(aktuelleArtikelNummer)
}

function zurueckButtonAusblenden(ziffer){
	if (ziffer == 0){
		$('p#back').hide();
	} else {
		$('p#back').show();
	}
}

function aktuelleArtikelNummerFinden(){
	var aktuellerArtikel = $('article.sichtbar').attr('id');
   	var aktuelleArtikelNummer = parseInt(aktuellerArtikel.slice(2));
   	// gibt eine echte Zahl zurueck!
   	return aktuelleArtikelNummer;
}

function aktivenArtikelMarkieren(ziffer){
	$('div#inhaltsangabe h1.aktiv').removeClass('aktiv');
	var x = 'div#inhaltsangabe h1:eq(' + ziffer + ')';
	$(x).addClass('aktiv');
}

//funktionalität der inhaltsangabe 
$(function(){
   	$('div#inhaltsangabe').hide();
   	$('div#index').click(function(){
   		warnungVerbergen();
   		$('div#inhaltsangabe').show('fast');
   	});
   	
   	$('div#inhaltsangabe a').click(function(){
   		var ziel = $(this).attr('href');
   		var zielArtikel = 'article' + ziel;
   		//alert (zielArtikel);
   		
   		var aktArtikel = $('article.sichtbar')
   		
   		$('div#inhaltsangabe').hide('slow');
   		
   		ArtikelAustauschen(aktArtikel, zielArtikel)
   		
   		aktuelleArtikelNummerEintragen();
   		
   		return false;
   	});
});

// der zurückbutton
$(function(){
	$('p#back').click(function(){
		zurueckGehen();
	});
});

// einen Slide weiter, wenn noch nicht auf letztem Slide
function weiterGehen(){
	$('div#inhaltsangabe').hide();
	var aktuelleArtikelNummer = aktuelleArtikelNummerFinden();
	var artikelAnzahl = $('div#wrap article').length;
	
	if (aktuelleArtikelNummer < (artikelAnzahl - 1)){
		var aktArtikel = 'article#A_' + aktuelleArtikelNummer;
		var nextArtikel = 'article#A_' + (aktuelleArtikelNummer +1);

		ArtikelAustauschen(aktArtikel, nextArtikel)
	
		aktuelleArtikelNummerEintragen();
		warnungVerbergen();
	} else {
		//alert ('letzter Slide der Präsentation!');
		warnungZeigen('letzter Slide der Präsentation…');
	}
}

// einen Slide zurück, wenn noch nicht auf Slide 0
function zurueckGehen(){
	$('div#inhaltsangabe').hide();
	var aktuelleArtikelNummer = aktuelleArtikelNummerFinden();
	
	if (aktuelleArtikelNummer > 0){
		var aktArtikel = 'article#A_' + aktuelleArtikelNummer;
		var lastArtikel = 'article#A_' + (aktuelleArtikelNummer -1);

		ArtikelAustauschen(aktArtikel, lastArtikel)
	
		aktuelleArtikelNummerEintragen();
		warnungVerbergen();
	} else {
		//alert ('erste Slide der Präsentation erreicht!');
		warnungZeigen('erster Slide der Präsentation…');
	}
}

// links bekommen eigene klasse, damit diese in neuem fenster geöffnet werden
$(function(){
	$('article a[href]').each(function(index){
		var myRef = $(this).attr('href');
		//neues Fenster nur, wenn es ein Link auf eine andere Site (http://) ist!
		//if (myRef.indexOf("http://")!=-1){
   			$(this).addClass('echtLink');
			$(this).attr('target', '_blank');
		//}
   	});
});

// hiermit kann man z.b. via eMail oder Link auf einer Website auf einen bestimmten 
// Artikel in der Presentation verweisen
// typische Adresse: http://mcthias-2.local:8888/scripte_iPad/jQuery_presentation/index.html#A_7
$(function(){
	// z.b #A_0
	var ha = window.location.hash;
	// nur falls hash vorhanden ist
	if (ha.length > 0) {
		// dieser soll dann unsichtbar geschaltet werden
		var aktArtikel = $('article:first')
		// der zu zeigende artikel
		var hashArtikel = 'article' + ha;
		//alert (hashArtikel);
		
		// nur wenn hashnummer innerhalb der anzahl der artikel ist
		// springt die pres dort sind, sonst auf artikel 0
		var gekuerzt = ha.slice(3);
		var hashnummer = parseInt(gekuerzt);
		var artikelAnzahl = $('div#wrap article').length;
		
		if (hashnummer < artikelAnzahl){
			ArtikelAustauschen(aktArtikel, hashArtikel);
			aktuelleArtikelNummerEintragen();
			warnungVerbergen();
		}
	}
});

// spezielles div erzeugen, in dem die Warnmeldungen sichtbar werden
$(function(){

	// aussehen des div#warnung wird bei basic.css festgelegt!
	// das div wird am unteren ende des body-code eingefuegt
	$('body').append('<div id="warnung"><p></p></div>');
	
	$('div#warnung').hide();
	
	$('div#warnung p').click(function(){
		warnungVerbergen();
		return false;
	});
});

function warnungZeigen(Meldung){
	$('div#warnung p').text(Meldung);
	$('div#warnung').fadeIn('slow');
}

function warnungVerbergen(){
	$('div#warnung').fadeOut('slow');
}
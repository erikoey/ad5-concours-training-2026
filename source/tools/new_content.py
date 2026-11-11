# -*- coding: utf-8 -*-
"""New questions added in the November 2026 revision.
Every item lists the CORRECT option first, followed by wrong options (with an optional short note).
make_data.py places the correct option at a balanced position and turns the notes into letter-keyed hints.
Numerical items are computed in code and asserted, so the stated answer cannot drift from the arithmetic.
"""

# ------------------------------------------------------------------ verbal (German, 4 options)
VERBAL = [
 dict(id="V21", tag="Formale und tatsächliche Feststellung",
  passage="Eine Behörde prüfte 90 Unternehmen auf die Einhaltung einer Meldefrist. 60 Unternehmen hielten die Frist ein. Die übrigen 30 Unternehmen reichten ihre Meldung verspätet oder gar nicht ein; 12 von ihnen hatten zuvor einen Antrag auf Fristverlängerung gestellt, über den noch nicht entschieden ist. Eine Fristverletzung wird nach den Vorschriften nur dann förmlich festgestellt, wenn kein Verlängerungsantrag vorliegt. Für alle Unternehmen ohne Antrag hat die Behörde die Verletzung bereits förmlich festgestellt. Weitere Verfahrensschritte sind zunächst nicht vorgesehen.",
  q="Welche der folgenden Aussagen lässt sich aus dem Text ableiten?",
  correct="Für 18 Unternehmen wurde die Fristverletzung bereits förmlich festgestellt.",
  wrong=[("Genau ein Drittel aller geprüften Unternehmen hat die Frist förmlich verletzt.","30 Unternehmen meldeten verspätet oder gar nicht, förmlich festgestellt wurde aber nur bei 18."),
         ("Die zwölf Unternehmen mit Verlängerungsantrag haben die Frist eingehalten.","Sie gehören ausdrücklich zu den 30 Unternehmen ohne fristgerechte Meldung."),
         ("Mehr als drei Viertel der geprüften Unternehmen hielten die Frist ein.","60 von 90 sind etwa 66,7 %.")],
  expl="30 Unternehmen meldeten nicht fristgerecht, 12 davon mit offenem Verlängerungsantrag. Bleiben 18 ohne Antrag; für sie wurde die Verletzung bereits förmlich festgestellt."),
 dict(id="V22", tag="Umkehrschluss und Kontraposition",
  passage="Alle Beschäftigten der Abteilung X haben die Schulung Y besucht. Wer die Schulung Y besucht hat, darf Zahlungen nicht ohne zweite Unterschrift freigeben. Frau Berger gibt Zahlungen ohne zweite Unterschrift frei. Ob außerhalb der Abteilung X weitere Personen die Schulung Y besucht haben, ist nicht bekannt. Ebenso ist unbekannt, ob es Personen gibt, die Zahlungen nur mit zweiter Unterschrift freigeben dürfen, ohne die Schulung Y besucht zu haben.",
  q="Welche der folgenden Aussagen lässt sich aus dem Text ableiten?",
  correct="Frau Berger hat die Schulung Y nicht besucht.",
  wrong=[("Frau Berger gehört zur Abteilung X.","Aus der Abteilungszugehörigkeit würde der Schulungsbesuch folgen – und damit das Verbot."),
         ("Alle, die die Schulung Y nicht besucht haben, dürfen Zahlungen ohne zweite Unterschrift freigeben.","Das Verbot gilt für Besucher der Schulung; die Umkehrung steht nicht im Text."),
         ("Nur Beschäftigte der Abteilung X haben die Schulung Y besucht.","Ausdrücklich unbekannt, ob andere Personen die Schulung besucht haben.")],
  expl="Wer die Schulung besucht hat, darf nicht ohne zweite Unterschrift freigeben. Frau Berger tut es dennoch, also kann sie die Schulung nicht besucht haben."),
 dict(id="V23", tag="Definition und Folgerung",
  passage="Eine Maßnahme gilt im Förderprogramm erst dann als „abgeschlossen“, wenn der Abschlussbericht eingereicht und von der Programmstelle geprüft wurde. Die Schlusszahlung wird nur für abgeschlossene Maßnahmen geleistet, und zwar innerhalb von 30 Tagen nach Abschluss. Bei Maßnahme M wurde der Abschlussbericht am 15. März eingereicht. Die Prüfung war Ende März noch nicht beendet. Die Programmstelle hat angekündigt, die Prüfung bis Mitte April abschließen zu wollen, gibt dafür aber keine Garantie.",
  q="Welche der folgenden Aussagen lässt sich aus dem Text ableiten?",
  correct="Maßnahme M war Ende März im Sinne des Programms noch nicht abgeschlossen.",
  wrong=[("Die Schlusszahlung für Maßnahme M erfolgt spätestens Mitte Mai.","Der Abschluss der Prüfung ist nicht garantiert; die 30 Tage laufen erst ab Abschluss."),
         ("Mit der Einreichung des Berichts am 15. März galt Maßnahme M als abgeschlossen.","Zusätzlich ist die Prüfung durch die Programmstelle erforderlich."),
         ("Die Programmstelle hat im Bericht zu Maßnahme M Mängel festgestellt.","Über das Ergebnis der Prüfung macht der Text keine Aussage.")],
  expl="Abschluss setzt Einreichung und abgeschlossene Prüfung voraus. Ende März lief die Prüfung noch, also war M noch nicht abgeschlossen."),
 dict(id="V24", tag="Vergleichbarkeit von Umfragewerten",
  passage="In einer Umfrage unter Beschäftigten einer Verwaltung lag die durchschnittliche Zufriedenheit auf einer Skala von 1 bis 5 bei 3,8. In der Vorjahresumfrage hatte der Mittelwert 3,6 betragen. Die Verwaltung weist darauf hin, dass sich in diesem Jahr 40 Personen weniger beteiligt haben und dass der Fragebogen um zwei Fragen gekürzt wurde. Der Median und die Verteilung der Antworten werden im Bericht nicht angegeben.",
  q="Welche der folgenden Aussagen lässt sich aus dem Text ableiten?",
  correct="Der berichtete Mittelwert lag um 0,2 Skalenpunkte über dem des Vorjahres.",
  wrong=[("Die Mehrheit der Befragten bewertete ihre Zufriedenheit mit mindestens 4.","Ohne Median oder Verteilung ist das nicht ableitbar."),
         ("Die Zufriedenheit aller Beschäftigten ist gegenüber dem Vorjahr gestiegen.","Beteiligung und Fragebogen haben sich geändert; ein Rückschluss auf alle ist nicht gedeckt."),
         ("Die Hälfte der Befragten wählte genau den Wert 3,8.","Ein Mittelwert muss kein vergebener Skalenwert sein; die Verteilung fehlt.")],
  expl="Beide Mittelwerte stehen im Text: 3,8 − 3,6 = 0,2. Weitergehende Aussagen über Mehrheiten oder alle Beschäftigten sind durch die Angaben nicht gedeckt."),
 dict(id="V25", tag="Regel, Ausnahme und Frist",
  passage="Reisekosten werden nur erstattet, wenn die Reise genehmigt wurde. Bei dringenden Dienstreisen kann die Genehmigung innerhalb von drei Arbeitstagen nach Reisebeginn nachträglich eingeholt werden. Wird sie nachträglich verweigert, besteht kein Erstattungsanspruch – es sei denn, die Verweigerung beruht ausschließlich auf einem Formfehler des Antrags, der innerhalb von fünf Arbeitstagen nach der Verweigerung behoben wird. Herr Kovač trat eine dringende Dienstreise an und beantragte die Genehmigung am zweiten Arbeitstag nach Reisebeginn nachträglich. Die Genehmigung wurde verweigert, ausschließlich weil das Antragsformular unvollständig war. Das vollständige Formular reichte er am vierten Arbeitstag nach der Verweigerung ein.",
  q="Welche der folgenden Aussagen lässt sich aus dem Text ableiten?",
  correct="Für Herrn Kovač besteht ein Erstattungsanspruch.",
  wrong=[("Herr Kovač hat die Genehmigung zu spät nachträglich beantragt.","Die Frist beträgt drei Arbeitstage; der zweite Arbeitstag liegt innerhalb."),
         ("Jede nachträglich verweigerte Genehmigung begründet einen Erstattungsanspruch.","Nur bei einem rechtzeitig behobenen Formfehler als alleinigem Grund."),
         ("Die Verweigerung der Genehmigung war ein Fehler der Verwaltung.","Der Text bewertet die Verweigerung nicht; der Formfehler lag im Antrag.")],
  expl="Rechtzeitiger nachträglicher Antrag (2. von 3 Tagen); Verweigerung allein wegen eines Formfehlers; Behebung am 4. von 5 Arbeitstagen. Damit greift die Ausnahme vom Ausschluss des Anspruchs."),
 dict(id="V26", tag="Bedingte Aussage und Mehrdeutigkeit",
  passage="Ein Gutachten empfiehlt, das Angebot auf mindestens 120 Plätze zu erweitern. Die Stadt hat Mittel für höchstens 100 zusätzliche Plätze bewilligt. Derzeit gibt es 40 Plätze. Aus dem Gutachten geht nicht eindeutig hervor, ob sich die Zahl 120 auf die Gesamtzahl der Plätze oder auf die Zahl zusätzlicher Plätze bezieht. Die Stadt hat noch nicht entschieden, wie viele der bewilligten Plätze sie tatsächlich einrichtet.",
  q="Welche der folgenden Aussagen lässt sich aus dem Text ableiten?",
  correct="Bezieht sich die Empfehlung auf die Gesamtzahl der Plätze, reichen die bewilligten Mittel dafür aus.",
  wrong=[("Die Empfehlung kann nur erfüllt werden, wenn die Stadt zusätzliche Mittel bewilligt.","Bei Bezug auf die Gesamtzahl genügen 80 zusätzliche Plätze."),
         ("Die Stadt hat sich verpflichtet, genau 100 zusätzliche Plätze einzurichten.","Bewilligt sind „höchstens“ 100 Plätze; die Entscheidung steht aus."),
         ("Derzeit erfüllt das Angebot die Empfehlung des Gutachtens bereits.","40 Plätze liegen unter 120, bei jeder Lesart der Empfehlung.")],
  expl="Gesamtzahl 120 bei 40 vorhandenen Plätzen bedeutet 80 zusätzliche Plätze – das liegt unter der bewilligten Höchstzahl von 100."),
]

# ------------------------------------------------------------------ numerical (German, 5 options)
def _fmt(x, d=1):
    s = f"{x:,.{d}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")

def numerical():
    items = []
    # N11 percentage points
    r23, r24 = 1250/2500*100, 1440/3200*100
    assert (r23, r24) == (50.0, 45.0)
    assert round((r24-r23)/r23*100, 1) == -10.0 and round((r23-r24)/r24*100, 1) == 11.1 and round((1440-1250)/1250*100, 1) == 15.2
    items.append(dict(id="N11", tag="Prozentpunkte und relative Veränderung",
      caption="Bewerbungen und erfolgreiche Bewerbungen je Jahr.",
      headers=["Jahr","Bewerbungen","Erfolgreich"], rows=[["2023","2.500","1.250"],["2024","3.200","1.440"]],
      q="Um wie viele Prozentpunkte hat sich die Erfolgsquote von 2023 auf 2024 verändert?",
      correct="−5,0 Prozentpunkte",
      wrong=[("−10,0 Prozentpunkte","Das ist die relative Veränderung der Quote (45 % gegenüber 50 %), nicht die Differenz in Prozentpunkten."),
             ("+15,2 Prozentpunkte","Das ist der relative Zuwachs der erfolgreichen Bewerbungen (1.440 gegenüber 1.250)."),
             ("−11,1 Prozentpunkte","Die relative Veränderung wurde auf den neuen Wert 45 % statt auf den alten bezogen."),
             ("+5,0 Prozentpunkte","Vorzeichenfehler: Die Quote sank von 50 % auf 45 %.")],
      expl="2023: 1.250/2.500 = 50 %. 2024: 1.440/3.200 = 45 %. Differenz: −5 Prozentpunkte."))
    # N12 VAT + discount
    brutto = 18400*1.19
    assert round(brutto, 2) == 21896.00 and round(brutto*0.98, 2) == 21458.08
    assert round(18400*1.17, 2) == 21528.00 and round(18400*0.98, 2) == 18032.00 and round(18400*1.21, 2) == 22264.00
    items.append(dict(id="N12", tag="Mehrwertsteuer und Skonto",
      caption="Rechnung. Das Skonto wird auf den Bruttobetrag berechnet.",
      headers=["Position","Wert"], rows=[["Nettobetrag","18.400 €"],["Mehrwertsteuer","19 %"],["Skonto bei Zahlung binnen 10 Tagen","2 %"]],
      q="Wie viel ist bei Zahlung innerhalb von zehn Tagen zu überweisen?",
      correct="21.458,08 €",
      wrong=[("21.896,00 €","Brutto ohne Skonto: 18.400 × 1,19."),
             ("21.528,00 €","Steuer und Skonto als Prozentsätze verrechnet: 18.400 × (1 + 0,19 − 0,02)."),
             ("18.032,00 €","Nur das Skonto vom Nettobetrag abgezogen; die Mehrwertsteuer fehlt."),
             ("22.264,00 €","Das Skonto wurde als Aufschlag behandelt: 18.400 × 1,21.")],
      expl="Brutto: 18.400 × 1,19 = 21.896 €. Skonto 2 %: 21.896 × 0,98 = 21.458,08 €."))
    # N13 average speed
    assert 270/(180/60+90/45) == 54 and (60+45)/2 == 52.5 and round((180*60+90*45)/270, 1) == 55.0 and round(2*60*45/105, 1) == 51.4
    items.append(dict(id="N13", tag="Durchschnittsgeschwindigkeit",
      caption="Zwei Teilstrecken einer Dienstfahrt, jeweils mit konstanter Geschwindigkeit.",
      headers=["Teilstrecke","Länge","Geschwindigkeit"], rows=[["1","180 km","60 km/h"],["2","90 km","45 km/h"]],
      q="Wie hoch ist die Durchschnittsgeschwindigkeit über die gesamte Strecke?",
      correct="54,0 km/h",
      wrong=[("52,5 km/h","Arithmetisches Mittel der beiden Geschwindigkeiten; die Fahrzeiten sind verschieden lang."),
             ("55,0 km/h","Geschwindigkeiten nach Streckenlänge statt nach Fahrzeit gewichtet."),
             ("51,4 km/h","Formel für zwei gleich lange Teilstrecken angewandt; hier sind die Strecken verschieden lang."),
             ("60,0 km/h","Es wurde nur die Geschwindigkeit der längeren Teilstrecke verwendet.")],
      expl="Zeit: 180/60 = 3 h und 90/45 = 2 h, zusammen 5 h. Strecke 270 km. 270/5 = 54 km/h."))
    # N14 share of total spending
    tot = 2.4*150 + 3.6*120 + 4.0*90
    assert round(tot, 1) == 1152.0 and round(3.6*120/tot*100, 1) == 37.5 and round(120/360*100, 1) == 33.3 and abs(360/tot*100-31.25) < 1e-9 and round(432/1000*100, 1) == 43.2
    items.append(dict(id="N14", tag="Anteil an einer Summe",
      caption="Ausgaben je Einwohner nach Region.",
      headers=["Region","Einwohner","Ausgaben je Einwohner"], rows=[["Nord","2,4 Mio.","150 €"],["Mitte","3,6 Mio.","120 €"],["Süd","4,0 Mio.","90 €"]],
      q="Wie hoch ist der Anteil der Region Mitte an den Gesamtausgaben aller drei Regionen?",
      correct="37,5 %",
      wrong=[("33,3 %","Nur die Pro-Kopf-Beträge verglichen (120 von 360 €); die Einwohnerzahlen fehlen."),
             ("36,0 %","Das ist der Einwohneranteil der Region Mitte (3,6 von 10,0 Mio.), nicht der Ausgabenanteil."),
             ("31,3 %","Die Ausgaben der Region Nord statt Mitte wurden ins Verhältnis gesetzt (360 von 1.152 Mio. €)."),
             ("43,2 %","Die Summe wurde mit 1.000 Mio. € statt 1.152 Mio. € angesetzt.")],
      expl="Ausgaben: Nord 360 Mio. €, Mitte 432 Mio. €, Süd 360 Mio. €; Summe 1.152 Mio. €. Mitte: 432/1.152 = 37,5 %."))
    # N15 growth then reduction
    base = 2_000_000
    assert round(base*1.04**3*0.90) == 2024755 and round(base*1.04**3) == 2249728 and round(base*1.12) == 2240000
    assert round(base*1.02) == 2040000 and round(base*1.12*0.90) == 2016000
    items.append(dict(id="N15", tag="Mehrjährige Veränderung",
      caption="Entwicklung eines Jahresbudgets. Die Änderungen wirken jeweils auf den Vorjahreswert.",
      headers=["Zeitraum","Veränderung gegenüber Vorjahr"], rows=[["Ausgangswert","2.000.000 €"],["Jahr 1 bis 3","je +4 %"],["Jahr 4","−10 %"]],
      q="Wie hoch ist das Budget nach Jahr 4 (auf ganze Euro gerundet)?",
      correct="2.024.755 €",
      wrong=[("2.040.000 €","Die Prozentsätze wurden addiert (+12 % − 10 % = +2 %), statt die Faktoren zu multiplizieren."),
             ("2.249.728 €","Der Rückgang in Jahr 4 fehlt."),
             ("2.240.000 €","Dreimal +4 % wurden addiert (+12 %) und der Rückgang fehlt."),
             ("2.016.000 €","Der Zuwachs wurde einfach addiert (+12 %), danach −10 % angewandt.")],
      expl="2.000.000 × 1,04³ = 2.249.728. Danach × 0,90 = 2.024.755,2 €, also 2.024.755 €."))
    # N16 ratio and redistribution
    A, B, C = 4.6e6*5/10, 4.6e6*3/10, 4.6e6*2/10
    freed = B*0.25
    assert (A, round(B), round(C), round(freed)) == (2300000.0, 1380000, 920000, 345000)
    assert round(C+0.4*freed) == 1058000 and round(C+freed) == 1265000 and round(C*1.25) == 1150000 and round(C+0.4*B) == 1472000 and round(C+0.2*B) == 1196000
    items.append(dict(id="N16", tag="Verhältnisse und Umverteilung",
      caption="Ein Gesamtbudget von 4,6 Mio. € ist im Verhältnis 5 : 3 : 2 auf die Programme A, B und C verteilt.",
      headers=["Programm","Anteil"], rows=[["A","5"],["B","3"],["C","2"]],
      q="Das Budget von B wird um 25 % gekürzt. 40 % des frei werdenden Betrags erhält C. Wie hoch ist danach das Budget von C?",
      correct="1.058.000 €",
      wrong=[("1.265.000 €","Der gesamte frei werdende Betrag wurde C zugeschlagen."),
             ("1.150.000 €","C wurde um 25 % erhöht statt um 40 % des frei werdenden Betrags."),
             ("1.472.000 €","40 % des ursprünglichen B-Budgets statt des frei werdenden Betrags wurden addiert."),
             ("1.196.000 €","20 % des B-Budgets statt 40 % des frei werdenden Betrags wurden addiert.")],
      expl="C: 2/10 × 4,6 Mio. = 920.000 €. B: 1.380.000 €; 25 % Kürzung = 345.000 €. 40 % davon = 138.000 €. Neues Budget von C: 1.058.000 €."))
    # N17 work rates
    left = (1-4*(1/12+1/18))/(1/12)
    assert abs(left-16/3) < 1e-9 and 12-4 == 8 and round((4/9)/(5/36), 1) == 3.2
    items.append(dict(id="N17", tag="Arbeitsgeschwindigkeit",
      caption="Zwei Teams bearbeiten dieselbe Aufgabe mit jeweils konstanter Leistung.",
      headers=["Team","Zeit für die gesamte Aufgabe allein"], rows=[["A","12 Tage"],["B","18 Tage"]],
      q="Beide Teams arbeiten vier Tage gemeinsam. Danach arbeitet nur Team A weiter. Wie viele weitere Tage braucht Team A bis zum Abschluss?",
      correct="5,3 Tage",
      wrong=[("8,0 Tage","Die vier gemeinsamen Tage wurden einfach von den 12 Tagen von Team A abgezogen."),
             ("3,2 Tage","Der Rest wurde mit der gemeinsamen statt mit der Einzelleistung von Team A berechnet."),
             ("6,0 Tage","Als Rest wurde die Hälfte der Aufgabe angenommen."),
             ("4,0 Tage","Als Rest wurde ein Drittel der Aufgabe angenommen.")],
      expl="Gemeinsame Leistung: 1/12 + 1/18 = 5/36 je Tag. In vier Tagen: 20/36 = 5/9 erledigt. Rest 4/9. Team A schafft 1/12 je Tag: (4/9)/(1/12) = 16/3 ≈ 5,3 Tage."))
    # N18 weighted criteria
    def sc(w, x): return sum(a*b for a, b in zip(w, x))
    X, Y = (80, 90, 60), (90, 70, 85)
    assert (sc((.5,.3,.2), X), sc((.5,.3,.2), Y)) == (79.0, 83.0)
    assert round(sum(Y)/3 - sum(X)/3, 1) == 5.0
    assert round(sc((.3,.5,.2), X) - sc((.3,.5,.2), Y), 1) == 2.0 and Y[0]-X[0] == 10
    assert round(sc((.5,.2,.3), Y) - sc((.5,.2,.3), X), 1) == 8.5
    items.append(dict(id="N18", tag="Gewichtete Bewertung",
      caption="Bewertung zweier Angebote (0–100 Punkte je Kriterium) mit Gewichtung.",
      headers=["Kriterium","Gewicht","Anbieter X","Anbieter Y"], rows=[["Qualität","50 %","80","90"],["Preis","30 %","90","70"],["Nachhaltigkeit","20 %","60","85"]],
      q="Um wie viele Punkte liegt der Erstplatzierte nach der gewichteten Gesamtpunktzahl vor dem Zweitplatzierten?",
      correct="4,0 Punkte",
      wrong=[("5,0 Punkte","Ungewichteter Durchschnitt: X 76,7 und Y 81,7 Punkte."),
             ("2,0 Punkte","Die Gewichte von Qualität und Preis wurden vertauscht (dann läge X vorn)."),
             ("10,0 Punkte","Es wurde nur das Kriterium Qualität verglichen."),
             ("8,5 Punkte","Die Gewichte von Preis und Nachhaltigkeit wurden vertauscht.")],
      expl="X: 0,5 × 80 + 0,3 × 90 + 0,2 × 60 = 79. Y: 0,5 × 90 + 0,3 × 70 + 0,2 × 85 = 83. Y führt mit 4,0 Punkten."))
    # N19 index back-calculation
    f = 1.05*1.08*0.97
    assert round(242/f) == 220 and round(242/(1.05*1.08)) == 213 and round(242*0.9) == 218 and round(242/1.16) == 209 and round(242*1.10) == 266
    items.append(dict(id="N19", tag="Indexrechnung",
      caption="Preisindex mit Basisjahr 2020 = 100. Die Veränderungen gelten jeweils gegenüber dem Vorjahr.",
      headers=["Jahr","Veränderung"], rows=[["2021","+5 %"],["2022","+8 %"],["2023","−3 %"]],
      q="Ein Produkt kostete im Jahr 2023 genau 242 €. Was kostete es im Jahr 2020 (auf ganze Euro gerundet)?",
      correct="220 €",
      wrong=[("213 €","Der Rückgang von 2023 wurde bei der Rückrechnung vergessen."),
             ("218 €","Es wurden pauschal 10 % von 242 € abgezogen."),
             ("209 €","Der Rückgang 2023 wurde als Zuwachs gerechnet (Faktor 1,16 als Summe)."),
             ("266 €","Die Preissteigerung wurde auf 242 € aufgeschlagen, statt zurückgerechnet.")],
      expl="Faktor 2020→2023: 1,05 × 1,08 × 0,97 = 1,09998 ≈ 1,10. 242/1,09998 ≈ 220 €."))
    # N20 nested percentages
    w = 1800*0.55; m = 1800-w
    assert round((w*0.4+m*0.3)/1800*100, 1) == 35.5 and round((0.45*0.4+0.55*0.3)*100, 1) == 34.5 and round(0.55*0.4*100, 1) == 22.0
    items.append(dict(id="N20", tag="Verschachtelte Prozentwerte",
      caption="Belegschaft einer Behörde: 1.800 Personen.",
      headers=["Gruppe","Anteil an der Belegschaft","Davon unter 30 Jahre"], rows=[["Frauen","55 %","40 %"],["Männer","45 %","30 %"]],
      q="Wie hoch ist der Anteil der unter 30-Jährigen an der gesamten Belegschaft?",
      correct="35,5 %",
      wrong=[("35,0 %","Einfaches Mittel von 40 % und 30 %; die Gruppen sind verschieden groß."),
             ("34,5 %","Die Gewichte der beiden Gruppen wurden vertauscht."),
             ("22,0 %","Nur der Anteil der Frauen unter 30 an der Belegschaft (55 % × 40 %)."),
             ("70,0 %","Beide Anteile wurden addiert.")],
      expl="Frauen: 990 × 0,4 = 396. Männer: 810 × 0,3 = 243. Zusammen 639 von 1.800 = 35,5 %."))
    return items


# ------------------------------------------------------------------ EU knowledge (English, 4 options)
def eu(area, id_, q, correct, wrong, expl, src):
    return dict(id=id_, area=area, q=q, correct=correct, wrong=wrong, expl=expl, source=src)

TEU = "http://data.europa.eu/eli/treaty/teu_2016/oj"
TFEU = "http://data.europa.eu/eli/treaty/tfeu_2016/oj"
CHAR = "http://data.europa.eu/eli/treaty/char_2012/oj"
def R(y, n): return f"http://data.europa.eu/eli/reg/{y}/{n}/oj"

EMU, IM, BUD, EXT, RIGHTS, JHA, DIG = ("Economic and monetary union","Internal market and competition","EU budget and funding",
  "Enlargement and external action","Rights, values and citizenship","Migration, justice and security","Digital policy")

EU_NEW = [
 eu(EMU,"EU69","Which institution is responsible for monetary policy in the euro area?","The European Central Bank, together with the national central banks of the euro area",
    ["The European Commission","The Council of the EU in its Economic and Financial Affairs configuration","The European Investment Bank"],
    "The ECB and the euro-area national central banks form the Eurosystem, which defines and implements monetary policy.",TFEU),
 eu(EMU,"EU70","The Treaty protocol on the excessive deficit procedure sets reference values for general government deficit and debt. Which values?","3% of GDP for the deficit and 60% of GDP for the debt",
    ["5% of GDP for the deficit and 80% of GDP for the debt","3% of GDP for the deficit and 90% of GDP for the debt","2% of GDP for the deficit and 60% of GDP for the debt"],
    "Protocol No 12 to the Treaties sets the reference values at 3% (deficit) and 60% (debt) of GDP.",TFEU),
 eu(EMU,"EU71","What is the European Semester?","A yearly cycle for coordinating Member States’ economic, fiscal and employment policies",
    ["A six-month rotation of the Council Presidency","A semester-long exchange programme for EU officials","The annual period during which Parliament votes on the budget"],
    "The European Semester organises the annual coordination of economic and budgetary policies, including country-specific recommendations.",TFEU),
 eu(EMU,"EU72","Which body can provide financial assistance to euro-area Member States in severe financial difficulty on the basis of a permanent intergovernmental mechanism?","The European Stability Mechanism",
    ["The European Court of Auditors","The European Investment Fund","The European Ombudsman"],
    "The ESM is a permanent crisis-resolution mechanism for euro-area Member States, established by an intergovernmental treaty.",TFEU),
 eu(EMU,"EU73","Which of the following is a convergence criterion for adopting the euro?","Price stability",
    ["A youth unemployment rate below 10%","A positive trade balance with the United States","A minimum number of seats in the European Parliament"],
    "The criteria cover price stability, public finances, exchange-rate stability and long-term interest rates. They do not cover unemployment or trade balances.",TFEU),
 eu(EMU,"EU74","What is the primary objective of the European System of Central Banks under the Treaties?","To maintain price stability",
    ["To maximise economic growth","To eliminate unemployment","To finance Member State budgets"],
    "Article 127 TFEU: the primary objective is price stability; without prejudice to it, the ESCB supports the general economic policies of the Union.",TFEU),

 eu(IM,"EU75","Which of the following is one of the four freedoms of the EU single market?","Free movement of capital",
    ["Free movement of national subsidies","Free movement of national legislation","Free movement of military forces"],
    "The four freedoms are the free movement of goods, services, capital and persons.",TFEU),
 eu(IM,"EU76","At EU level, which institution is mainly responsible for enforcing EU competition rules on cartels and abuse of dominance?","The European Commission",
    ["The European Parliament","The European Council","The Court of Auditors"],
    "The Commission is the EU competition authority and works with national competition authorities and the EU courts.",TFEU),
 eu(IM,"EU77","What does a customs union involve?","A common external tariff and no customs duties between its members",
    ["A single currency for all members","Common taxation of income","A shared army"],
    "The EU is a customs union: no internal customs duties and a common customs tariff towards third countries.",TFEU),
 eu(IM,"EU78","What does the principle of mutual recognition mean for goods in the single market?","A product lawfully marketed in one Member State can in principle be sold in the others",
    ["All products must meet one single EU-wide quality standard","Products may only be sold in the Member State where they were made","Every product needs a licence from the Commission"],
    "Mutual recognition (Cassis de Dijon) allows products lawfully marketed in one Member State to circulate in others, subject to justified exceptions.",TFEU),
 eu(IM,"EU79","Which type of EU funding mainly aims to reduce economic and social disparities between regions?","The European Regional Development Fund (ERDF)",
    ["The European Agricultural Guarantee Fund (EAGF)","The European Maritime, Fisheries and Aquaculture Fund (EMFAF)","The Innovation Fund of the Emissions Trading System"],
    "The ERDF is a main cohesion policy fund, investing in less developed regions and reducing regional disparities.",R(2021,1058)),

 eu(BUD,"EU80","For how many years does the EU’s multiannual financial framework (MFF) normally run?","Seven years",
    ["Three years","Five years","Ten years"],
    "The MFF sets spending ceilings for several years; the current one covers 2021–2027. The Treaties require at least five years.",R(2020,2093)),
 eu(BUD,"EU81","Who adopts the annual EU budget?","The European Parliament and the Council of the EU",
    ["The European Commission alone","The European Council alone","The Court of Auditors and the Commission"],
    "The Parliament and the Council are the budgetary authority; the Commission proposes the draft budget.",TFEU),
 eu(BUD,"EU82","Which of the following is an EU ‘own resource’?","Customs duties on imports from outside the EU",
    ["Contributions from the annual profits of the European Central Bank","Income tax paid by EU citizens directly to the Commission","Dividends from shares in European companies"],
    "Own resources include traditional own resources (customs duties), VAT-based and gross-national-income-based contributions and a plastic-packaging contribution.",TFEU),
 eu(BUD,"EU83","Which institution grants the Commission discharge for the implementation of the annual budget?","The European Parliament, on a recommendation from the Council",
    ["The European Court of Auditors","The Eurogroup","The European Central Bank"],
    "Under Article 319 TFEU, the European Parliament gives discharge on a recommendation of the Council. The Court of Auditors audits and reports.",TFEU),
 eu(BUD,"EU84","What is the centrepiece of the NextGenerationEU recovery instrument?","The Recovery and Resilience Facility",
    ["The Erasmus+ programme","The Common Fisheries Policy","The European Defence Fund"],
    "The Recovery and Resilience Facility finances reforms and investments in Member States’ recovery and resilience plans.",R(2021,241)),
 eu(BUD,"EU85","Which fund pays direct payments to farmers under the Common Agricultural Policy?","The European Agricultural Guarantee Fund (EAGF)",
    ["The European Regional Development Fund (ERDF)","The European Social Fund Plus (ESF+)","The Cohesion Fund"],
    "The EAGF finances direct payments and market measures; the EAFRD finances rural development.",R(2021,2116)),

 eu(EXT,"EU86","Which Treaty article sets out the procedure for a Member State to withdraw from the EU?","Article 50 of the Treaty on European Union",
    ["Article 7 of the Treaty on European Union","Article 49 of the Treaty on European Union","Article 288 of the Treaty on the Functioning of the EU"],
    "Article 50 TEU provides for notification of the intention to withdraw and negotiation of a withdrawal agreement.",TEU),
 eu(EXT,"EU87","Which of the following is one of the Copenhagen criteria for EU accession?","A functioning market economy and the capacity to cope with competitive pressure in the Union",
    ["Membership of NATO","A population of at least ten million","The prior adoption of the euro"],
    "The 1993 Copenhagen criteria are political (stable institutions guaranteeing democracy, rule of law, human rights), economic and the ability to take on the obligations of membership.",TEU),
 eu(EXT,"EU88","Who chairs the Foreign Affairs Council?","The High Representative of the Union for Foreign Affairs and Security Policy",
    ["The President of the European Parliament","The President of the European Central Bank","The President of the Court of Justice"],
    "Article 18 TEU: the High Representative chairs the Foreign Affairs Council.",TEU),
 eu(EXT,"EU89","How does the Council of the EU normally decide on matters of the Common Foreign and Security Policy?","By unanimity",
    ["By qualified majority","By simple majority","By a vote of the European Parliament alone"],
    "CFSP decisions are generally taken unanimously, with limited exceptions.",TEU),
 eu(EXT,"EU90","In the Council of the EU, a qualified majority is reached when at least what share of Member States, representing what share of the EU population, vote in favour?","55% of Member States, representing at least 65% of the population",
    ["50% of Member States, representing at least 50% of the population","67% of Member States, representing at least 75% of the population","72% of Member States, representing at least 65% of the population"],
    "Article 16(4) TEU: at least 55% of the members, comprising at least fifteen of them and representing at least 65% of the population (with a blocking-minority rule).",TEU),
 eu(EXT,"EU91","What does CSDP stand for?","Common Security and Defence Policy",
    ["Central Security and Diplomacy Programme","Common Single Defence Pact","Cooperative Strategic Development Plan"],
    "The CSDP is an integral part of the Common Foreign and Security Policy.",TEU),

 eu(RIGHTS,"EU92","Since which Treaty has the Charter of Fundamental Rights of the EU had the same legal value as the Treaties?","The Treaty of Lisbon",
    ["The Maastricht Treaty","The Treaty of Amsterdam","The Treaty of Nice"],
    "Under Article 6(1) TEU, as amended by the Treaty of Lisbon (in force since 2009), the Charter has the same legal value as the Treaties.",CHAR),
 eu(RIGHTS,"EU93","What does a European Citizens’ Initiative allow?","One million citizens from at least seven Member States to invite the Commission to propose legislation",
    ["Any citizen to veto an EU law","Citizens to elect the President of the Commission directly","Ten Member States to change the Treaties"],
    "The Citizens’ Initiative requires one million signatures from at least a quarter of Member States (seven); the Commission decides how to respond.",R(2019,788)),
 eu(RIGHTS,"EU94","Which court sits in Strasbourg and is not an EU institution?","The European Court of Human Rights",
    ["The Court of Justice of the European Union","The General Court","The European Court of Auditors"],
    "The ECtHR belongs to the Council of Europe and applies the European Convention on Human Rights.",TEU),
 eu(RIGHTS,"EU95","Which of the following is a value listed in Article 2 of the Treaty on European Union?","The rule of law",
    ["Economic competitiveness","Energy independence","Fiscal neutrality"],
    "Article 2 TEU lists human dignity, freedom, democracy, equality, the rule of law and respect for human rights.",TEU),
 eu(RIGHTS,"EU96","Which Treaty mechanism can lead to the suspension of certain rights of a Member State, including its voting rights in the Council?","The procedure in Article 7 of the Treaty on European Union",
    ["The procedure in Article 50 of the Treaty on European Union","The excessive deficit procedure","The ordinary revision procedure"],
    "Article 7 TEU covers a clear risk of, or a serious and persistent breach of, the values in Article 2.",TEU),

 eu(JHA,"EU97","What does the Schengen area allow?","Travel between participating countries without border checks at internal borders",
    ["Free access to social security benefits in every country","Voting in national elections of any participating country","Unlimited stays for non-EU nationals"],
    "Schengen abolishes internal border checks while strengthening external border management.",TFEU),
 eu(JHA,"EU98","Which EU agency supports Member States in managing the EU’s external borders?","Frontex, the European Border and Coast Guard Agency",
    ["Europol","The European Environment Agency","The European Banking Authority"],
    "Frontex coordinates operational support for Member States at the external borders.",R(2019,1896)),
 eu(JHA,"EU99","Which EU agency, based in The Hague, supports national police authorities in fighting serious crime and terrorism?","Europol",
    ["Frontex","The European Union Agency for Asylum","Eurostat"],
    "Europol supports law-enforcement cooperation; its seat is in The Hague.",R(2016,794)),
 eu(JHA,"EU100","What is the main task of the European Public Prosecutor’s Office (EPPO)?","Investigating and prosecuting crimes against the EU’s financial interests",
    ["Prosecuting all serious crimes in the Member States","Reviewing the legality of EU legislation","Supervising national courts"],
    "EPPO, based in Luxembourg, is competent for offences such as fraud affecting the EU budget.",R(2017,1939)),
 eu(JHA,"EU101","What does the principle of non-refoulement prohibit?","Returning a person to a country where they would face serious harm such as persecution or torture",
    ["Granting asylum to more than one family member","Issuing visas for stays longer than 90 days","Registering asylum seekers at the external border"],
    "Non-refoulement is a core protection principle reflected in the Charter and the Geneva Convention.",CHAR),

 eu(DIG,"EU102","Which EU act governs the protection of personal data and applies directly in all Member States?","The General Data Protection Regulation",
    ["The Digital Markets Act","The Data Governance Act","The ePrivacy Directive"],
    "Regulation (EU) 2016/679 (GDPR) applies directly and has applied since 25 May 2018.",R(2016,679)),
 eu(DIG,"EU103","What is the main aim of the Digital Services Act?","Setting rules for online intermediaries and platforms on illegal content, transparency and user protection",
    ["Regulating the prices of digital devices","Creating a single EU telecommunications operator","Taxing digital advertising at EU level"],
    "Regulation (EU) 2022/2065 sets due-diligence and transparency obligations for online intermediaries and very large platforms.",R(2022,2065)),
 eu(DIG,"EU104","Who is the Digital Markets Act mainly aimed at?","Very large online platforms designated as ‘gatekeepers’",
    ["All small and medium-sized enterprises","National governments","Telecom consumers only"],
    "Regulation (EU) 2022/1925 sets obligations for gatekeepers to keep digital markets fair and contestable.",R(2022,1925)),
 eu(DIG,"EU105","How does the EU AI Act classify AI systems for regulatory purposes?","According to the level of risk they pose",
    ["According to the size of the provider’s workforce","According to the country where the model was developed","According to the programming language used"],
    "Regulation (EU) 2024/1689 follows a risk-based approach, from prohibited practices to minimal risk.",R(2024,1689)),
 eu(DIG,"EU106","Which EU programme for 2021–2027 funds supercomputing, artificial intelligence, cybersecurity and advanced digital skills?","The Digital Europe Programme",
    ["The LIFE programme","The Creative Europe programme","The Common Agricultural Policy"],
    "Regulation (EU) 2021/694 establishes the Digital Europe Programme.",R(2021,694)),

 eu("Treaties and history","EU107","What did the Treaty of Lisbon introduce for the European Council?","A full-time President of the European Council",
    ["A directly elected President","A rotating presidency every month","A permanent seat in Strasbourg"],
    "The Lisbon Treaty made the European Council a formal institution with a permanent President elected for a term of two and a half years.",TEU),
 eu("EU institutions and procedures","EU108","What was the ordinary legislative procedure called before the Treaty of Lisbon?","Co-decision",
    ["Consultation","Assent","Comitology"],
    "The Treaty of Lisbon renamed co-decision as the ordinary legislative procedure and extended it.",TFEU),
 eu("EU institutions and procedures","EU109","Which of the following institutions has its seat in Luxembourg?","The Court of Justice of the European Union",
    ["The European Central Bank","The Committee of the Regions","The European Commission"],
    "The Court of Justice sits in Luxembourg; the ECB is in Frankfurt and the Commission and Committee of the Regions are in Brussels.",TFEU),
 eu("EU agencies","EU110","Which body, owned by the Member States, finances investment projects that support EU policy goals?","The European Investment Bank",
    ["The European Central Bank","The European Bank for Reconstruction and Development","The European Ombudsman"],
    "The EIB is the EU’s lending arm and is owned by the Member States.",TFEU),
 eu("Climate and energy","EU111","What is the legally binding EU target for net greenhouse gas emission reductions by 2030 under the European Climate Law?","At least 55% compared with 1990",
    ["At least 30% compared with 1990","At least 40% compared with 2005","At least 80% compared with 1990"],
    "The European Climate Law sets climate neutrality by 2050 and an intermediate target of at least 55% net reduction by 2030 (against 1990).",R(2021,1119)),
 eu("Climate and energy","EU112","On which principle is the EU Emissions Trading System based?","Cap and trade",
    ["A uniform carbon tax collected by the Commission","Voluntary pledges by companies","A ban on all fossil fuels from 2030"],
    "A cap on total emissions is set; installations receive or buy allowances and can trade them.","http://data.europa.eu/eli/dir/2003/87/oj"),
 eu("Policies and programmes","EU113","Which programme is the EU’s main funding programme for research and innovation in 2021–2027?","Horizon Europe",
    ["Erasmus+","Digital Europe","Creative Europe"],
    "Horizon Europe (Regulation (EU) 2021/695) is the main EU research and innovation programme.",R(2021,695)),
]

# ------------------------------------------------------------------ digital skills (English, 4 options)
def dg(area, id_, q, correct, wrong, expl, src="https://publications.jrc.ec.europa.eu/repository/handle/JRC128415"):
    return dict(id=id_, area=area, q=q, correct=correct, wrong=wrong, expl=expl, source=src)

IDL, CC, DCC, SAF, PS = ("Information and data literacy","Communication and collaboration","Digital content creation","Safety","Problem-solving")

DIGITAL_NEW = [
 dg(IDL,"DS41","You need web results that contain the exact phrase “reserve list” and not just the individual words. What should you do?","Put the phrase in quotation marks",
    ["Type the words in capital letters","Add the word ‘only’ before the phrase","Separate the words with commas"],
    "Quotation marks make most search engines treat the words as one exact phrase."),
 dg(IDL,"DS42","An unfamiliar website makes a striking health claim. What is the best way to judge its credibility?","Check who is responsible for the content, its date and its sources, and compare with independent reliable sources",
    ["Trust it if it appears first in search results","Trust it if the page looks professional","Trust it if many people have shared it"],
    "Credibility depends on authorship, evidence and corroboration; ranking, design and popularity are not evidence."),
 dg(IDL,"DS43","You manage hundreds of project files. Which practice makes them easiest to find and avoids confusion between versions?","A consistent folder structure and file naming convention, for example with dates and version numbers",
    ["Saving everything on the desktop with short names","Naming files by the day of the week","Keeping only the newest version and deleting all others immediately"],
    "Consistent structure and naming make retrieval and version control predictable."),
 dg(IDL,"DS44","What is a key advantage of CSV files for exchanging tabular data between applications?","They are plain text and can be read by almost any data tool",
    ["They always preserve cell colours and formulas","They are encrypted by default","They can only be opened by one spreadsheet program"],
    "CSV stores values as plain text separated by delimiters; it does not store formatting or formulas."),

 dg(CC,"DS45","You must share a confidential draft with five colleagues who need to comment on it. What is the most appropriate approach?","Share a link with restricted access in the organisation’s approved file-sharing tool, giving only those five people permission to comment",
    ["Send the file as an attachment to a large mailing list","Post the file on a public website with a hard-to-guess link","Copy the text into a chat group that includes external guests"],
    "Restricted sharing limits access, keeps one master version and allows revocation."),
 dg(CC,"DS46","Several colleagues need to edit the same report at the same time. Which approach best avoids conflicting versions?","Use a shared online document with real-time co-editing and version history",
    ["Each person edits a copy and e-mails it back","Take turns by phone and retype the changes","Use one USB stick passed between colleagues"],
    "Co-editing in one shared document keeps a single master version and a change history."),
 dg(CC,"DS47","You send an announcement to many external recipients who do not know one another. Which e-mail field should you use for their addresses?","Bcc, so that recipients cannot see each other’s addresses",
    ["To, so that everyone can reply easily","Cc, so that everyone is informed","The subject line"],
    "Bcc protects recipients’ privacy, which is also a data-protection concern."),
 dg(CC,"DS48","In the EU legal framework for electronic identification and trust services (eIDAS), what is a qualified electronic signature?","An electronic signature with the same legal effect as a handwritten signature",
    ["A scanned image of a handwritten signature","A typed name at the end of an e-mail","A password-protected PDF"],
    "Qualified electronic signatures have the equivalent legal effect of handwritten signatures and are recognised across the EU.","http://data.europa.eu/eli/reg/2014/910/oj"),

 dg(DCC,"DS49","You want to reuse a photograph from the web in a public presentation. What should you check first?","The licence or copyright terms and any attribution requirement",
    ["Whether the image resolution is high","Whether the picture has a watermark","Whether it is the first result in an image search"],
    "Reuse depends on the licence, for example a Creative Commons licence with attribution."),
 dg(DCC,"DS50","Why should you add alternative text to images in a document?","So that people using screen readers receive the information the image conveys",
    ["To make the file smaller","To protect the image from copying","To change the image’s colours automatically"],
    "Alternative text is a basic accessibility feature."),
 dg(DCC,"DS51","What is the advantage of using built-in heading styles instead of manually enlarging text?","The structure is machine-readable, enabling navigation, an automatic table of contents and better accessibility",
    ["The text is automatically translated","The document is protected against editing","Spelling errors are corrected automatically"],
    "Heading styles define a document structure that tools and assistive technologies can use."),
 dg(DCC,"DS52","In a spreadsheet, you copy a formula that must always refer to the same cell, A1. Which reference should you use?","$A$1",
    ["A1","$A1","A$1"],
    "Absolute references with dollar signs remain fixed when the formula is copied."),

 dg(SAF,"DS53","You receive an urgent e-mail apparently from your bank asking you to click a link and confirm your password. What is the best action?","Do not click; open the bank’s official website yourself or call a known number, and report the message",
    ["Click the link but only enter part of the password","Reply to the sender asking whether it is genuine","Forward the e-mail to colleagues as a warning with the link intact"],
    "This is a typical phishing pattern. Use independent channels and report it."),
 dg(SAF,"DS54","What is the main benefit of multi-factor authentication?","An attacker who has stolen the password still lacks the second factor",
    ["It makes passwords unnecessary","It encrypts all e-mails automatically","It speeds up logging in"],
    "A second factor, such as an app code or security key, reduces the risk of account takeover."),
 dg(SAF,"DS55","What is the main advantage of using a password manager?","You can use long, unique passwords for each service without memorising them",
    ["Passwords no longer need to be changed after a data breach","It prevents all phishing attacks","It lets you share one password across all accounts safely"],
    "Unique passwords limit the damage if one service is compromised."),
 dg(SAF,"DS56","You must access your work e-mail from a public Wi-Fi network. Which is the most appropriate precaution?","Use the organisation’s approved VPN or secure connection",
    ["Turn off the device’s firewall to improve speed","Disable updates to avoid interruptions","Use a shared computer without logging out"],
    "A VPN encrypts traffic between your device and the organisation, reducing risks on untrusted networks."),

 dg(PS,"DS57","You need to convert 500 scanned pages into text that can be searched and edited. Which technology is most appropriate?","Optical character recognition (OCR)",
    ["Data compression","Screen mirroring","A spell checker"],
    "OCR recognises characters in images and converts them to machine-readable text."),
 dg(PS,"DS58","An online collaboration service suddenly stops working for many colleagues. What is a sensible first step?","Check the provider’s official service-status page and the organisation’s IT notices",
    ["Reinstall the operating system","Delete your account and create a new one","Wait a week before doing anything"],
    "Status pages and IT notices help determine whether the problem is a known outage rather than a local fault."),
 dg(PS,"DS59","You must find a meeting time for ten colleagues in different time zones. Which tool is most suitable?","A scheduling poll or shared calendar that shows availability",
    ["A group phone call to negotiate each slot","An e-mail chain with all replies in one thread","A printed timetable posted in the office"],
    "Scheduling tools automate the comparison of availability and handle time zones."),
 dg(PS,"DS60","You repeat the same formatting steps on dozens of documents every week. What is the most efficient approach?","Create a template or automate the steps with macros or a built-in automation feature",
    ["Do it manually but faster","Ask colleagues to format their own documents","Stop formatting the documents"],
    "Templates and automation reduce repetitive manual work and errors."),
]

# ---- revision after duplicate check: drop items already covered by the original bank, add replacements
_DROP = {"EU75", "EU79", "EU98", "EU99", "EU113"}
EU_NEW = [q for q in EU_NEW if q["id"] not in _DROP] + [
 eu(IM,"EU114","What does the CE marking on a product indicate?","That the manufacturer declares conformity with the applicable EU health, safety and environmental requirements",
    ["That the product was made in the European Union","That the product has been tested and approved by the European Commission","That the product is among the best in its category"],
    "CE marking is the manufacturer’s declaration of conformity with applicable EU requirements; it is not a quality label or an indication of origin.",TFEU),
 eu(JHA,"EU115","Which EU agency, based in Valletta, supports Member States in applying EU asylum rules?","The European Union Agency for Asylum (EUAA)",
    ["Frontex","Europol","The European Union Agency for Fundamental Rights"],
    "The EUAA provides operational and technical support to national asylum authorities.","http://data.europa.eu/eli/reg/2021/2303/oj"),
 eu(JHA,"EU116","Which EU body coordinates judicial cooperation in criminal matters between national authorities?","Eurojust",
    ["The European Court of Auditors","The European Committee of the Regions","The European Ombudsman"],
    "Eurojust, based in The Hague, supports cooperation between national prosecutors and judicial authorities in cross-border cases.",TFEU),
]
DIGITAL_NEW = [q for q in DIGITAL_NEW if q["id"] != "DS46"] + [
 dg(CC,"DS46","A team needs to keep track of who is responsible for which task on a shared project and by when. Which tool is most suitable?","A shared task board or project-management tool with assignees and deadlines",
    ["A personal notebook kept by each team member","Private text messages between individual colleagues","A printed list that one person updates weekly"],
    "A shared board gives everyone the same current view of tasks, owners and deadlines."),
]

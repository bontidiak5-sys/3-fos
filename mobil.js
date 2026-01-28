function mentes(kulcs, adat) {
    localStorage.setItem(kulcs, JSON.stringify(adat));
}
function betolt(kulcs) {
    var adat = localStorage.getItem(kulcs);
    if (adat) return JSON.parse(adat);
    return [];
}


var nevjegyek = betolt('nevjegyek');
var csoportok = betolt('csoportok');
var szerkesztId = null;


var nevjegyNezet = document.getElementById('contactsView');
var csoportNezet = document.getElementById('groupsView');
var nevjegyGomb = document.getElementById('contactsViewBtn');
var csoportGomb = document.getElementById('groupsViewBtn');
var nevjegyLista = document.getElementById('contactsList');
var csoportLista = document.getElementById('groupsList');
var ujNevjegyGomb = document.getElementById('addContactBtn');
var ujCsoportGomb = document.getElementById('addGroupBtn');
var nevjegyUrlap = document.getElementById('contactForm');
var csoportUrlap = document.getElementById('groupForm');
var nevjegyMegse = document.getElementById('cancelContactBtn');
var csoportMegse = document.getElementById('cancelGroupBtn');
var csoportValaszto = document.getElementById('groupSelectContainer');


nevjegyGomb.onclick = function() { nezetValt('nevjegy'); };
csoportGomb.onclick = function() { nezetValt('csoport'); };
function nezetValt(melyik) {
    if (melyik === 'nevjegy') {
        nevjegyNezet.classList.remove('hidden');
        csoportNezet.classList.add('hidden');
        nevjegyGomb.classList.add('active');
        csoportGomb.classList.remove('active');
    } else {
        nevjegyNezet.classList.add('hidden');
        csoportNezet.classList.remove('hidden');
        nevjegyGomb.classList.remove('active');
        csoportGomb.classList.add('active');
    }
}


ujNevjegyGomb.onclick = function() {
    nevjegyUrlap.reset();
    szerkesztId = null;
    csoportValasztoFeltolt();
    nevjegyUrlap.classList.remove('hidden');
};
nevjegyMegse.onclick = function() {
    nevjegyUrlap.classList.add('hidden');
};


ujCsoportGomb.onclick = function() {
    csoportUrlap.reset();
    csoportUrlap.classList.remove('hidden');
};
csoportMegse.onclick = function() {
    csoportUrlap.classList.add('hidden');
};


nevjegyUrlap.onsubmit = function(e) {
    e.preventDefault();
    var uj = {
        id: szerkesztId || Date.now(),
        vezetek: document.getElementById('lastName').value,
        kereszt: document.getElementById('firstName').value,
        otthon: document.getElementById('homePhone').value,
        mobil: document.getElementById('mobilePhone').value,
        email: document.getElementById('email').value,
        cim: document.getElementById('address').value,
        szuletett: document.getElementById('birthdate').value,
        megjegyzes: document.getElementById('note').value,
        csoportok: Array.from(document.querySelectorAll('input[name="contactGroups"]:checked')).map(function(cb){return cb.value;})
    };
    if (szerkesztId) {
        nevjegyek = nevjegyek.map(function(n){ return n.id === szerkesztId ? uj : n; });
    } else {
        nevjegyek.push(uj);
    }
    mentes('nevjegyek', nevjegyek);
    nevjegyUrlap.classList.add('hidden');
    nevjegyListaFeltolt();
};


csoportUrlap.onsubmit = function(e) {
    e.preventDefault();
    var uj = {
        id: Date.now(),
        nev: document.getElementById('groupName').value,
        leiras: document.getElementById('groupDesc').value
    };
    csoportok.push(uj);
    mentes('csoportok', csoportok);
    csoportUrlap.classList.add('hidden');
    csoportListaFeltolt();
    csoportValasztoFeltolt();
};


function nevjegyListaFeltolt() {
    nevjegyLista.innerHTML = '';
    if (nevjegyek.length === 0) {
        nevjegyLista.innerHTML = '<p>Nincs névjegy.</p>';
        return;
    }
    nevjegyek.forEach(function(n) {
        var kartya = document.createElement('div');
        kartya.className = 'card';
        kartya.innerHTML =
            '<strong>' + n.vezetek + ' ' + n.kereszt + '</strong>' +
            '<span>Mobil: ' + (n.mobil || '-') + '</span>' +
            '<span>Otthoni: ' + (n.otthon || '-') + '</span>' +
            '<span>Email: ' + (n.email || '-') + '</span>' +
            '<span>Csoportok: ' + (n.csoportok.map(function(id){return csoportNev(id);}).join(', ') || '-') + '</span>' +
            '<div class="actions">' +
                '<button onclick="szerkesztNevjegy(' + n.id + ')">Szerkeszt</button>' +
                '<button onclick="torolNevjegy(' + n.id + ')">Töröl</button>' +
            '</div>';
        nevjegyLista.appendChild(kartya);
    });
}


function csoportListaFeltolt() {
    csoportLista.innerHTML = '';
    if (csoportok.length === 0) {
        csoportLista.innerHTML = '<p>Nincs csoport.</p>';
        return;
    }
    csoportok.forEach(function(c) {
        var kartya = document.createElement('div');
        kartya.className = 'card';
        kartya.innerHTML =
            '<strong>' + c.nev + '</strong>' +
            '<span>' + (c.leiras || '') + '</span>' +
            '<div class="actions">' +
                '<button onclick="torolCsoport(' + c.id + ')">Töröl</button>' +
            '</div>';
        csoportLista.appendChild(kartya);
    });
}


function csoportNev(id) {
    var c = csoportok.find(function(x){return x.id == id;});
    return c ? c.nev : '';
}


window.szerkesztNevjegy = function(id) {
    var n = nevjegyek.find(function(x){return x.id === id;});
    if (!n) return;
    szerkesztId = id;
    document.getElementById('lastName').value = n.vezetek;
    document.getElementById('firstName').value = n.kereszt;
    document.getElementById('homePhone').value = n.otthon;
    document.getElementById('mobilePhone').value = n.mobil;
    document.getElementById('email').value = n.email;
    document.getElementById('address').value = n.cim;
    document.getElementById('birthdate').value = n.szuletett;
    document.getElementById('note').value = n.megjegyzes;
    csoportValasztoFeltolt(n.csoportok);
    nevjegyUrlap.classList.remove('hidden');
};


window.torolNevjegy = function(id) {
    if (confirm('Biztosan törlöd ezt a névjegyet?')) {
        nevjegyek = nevjegyek.filter(function(x){return x.id !== id;});
        mentes('nevjegyek', nevjegyek);
        nevjegyListaFeltolt();
    }
};


window.torolCsoport = function(id) {
    if (confirm('Biztosan törlöd ezt a csoportot?')) {
        csoportok = csoportok.filter(function(x){return x.id !== id;});
        nevjegyek = nevjegyek.map(function(n){
            n.csoportok = n.csoportok.filter(function(gid){return gid != id;});
            return n;
        });
        mentes('csoportok', csoportok);
        mentes('nevjegyek', nevjegyek);
        csoportListaFeltolt();
        nevjegyListaFeltolt();
        csoportValasztoFeltolt();
    }
};


function csoportValasztoFeltolt(kijelolt) {
    if (!kijelolt) kijelolt = [];
    csoportValaszto.innerHTML = '';
    if (csoportok.length === 0) return;
    csoportValaszto.innerHTML = '<label>Csoportok:</label>';
    csoportok.forEach(function(c) {
        var checked = kijelolt.includes(c.id) ? 'checked' : '';
        csoportValaszto.innerHTML +=
            '<label><input type="checkbox" name="contactGroups" value="' + c.id + '" ' + checked + '> ' + c.nev + '</label>';
    });
}


nevjegyListaFeltolt();
csoportListaFeltolt();
nezetValt('nevjegy');

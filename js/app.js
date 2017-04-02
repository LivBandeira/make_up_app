function convert() {
    let base = document.getElementById('base').value;
    let symbols = document.getElementById('symbols').value;
    let value = document.getElementById('value').value;

    if (value == '0.00') {
        alert('You need to inform the value!');
    } else if (symbols == base) {
        alert('The currencies should be different!');
    } else {
        let currencies = {};
        let url = 'http://api.fixer.io/latest?symbols=' + symbols + '&base=' + base;
        let xhr = new XMLHttpRequest();

        currencies.base = base;
        currencies.symbols = symbols;

        localStorage.setItem('currencies', JSON.stringify(currencies));

        if ('withCredentials' in xhr) {
            xhr.open('GET', url, true);
        } else if (typeof XDomainRequest != 'undefined') {
            xhr = new XDomainRequest();
            xhr.open('GET', url);
        } else {
            xhr = null;
        }

        xhr.onload = function() {
            if (this.status == 200) {
                let response = JSON.parse(this.response);
                let rate = response.rates[symbols];

                document.getElementById('result').innerHTML = (rate * value.replace(',', '')).toFixed(4);
            } else {
                alert('Connection Error!');
            }
        };

        xhr.send();
    }
}

window.onload = function() {
    let currencies = [];
    let storage = localStorage.getItem('currencies');

    if (storage != 'null') {
        currencies = JSON.parse(storage);
    }

    document.getElementById('base').value = currencies.base;
    document.getElementById('symbols').value = currencies.symbols;
};
import urllib
import urllib2

FUCK = 100
for i in range(FUCK):
    url = 'http://dev.jata.ru/api/sms/send_sms'
    user_agent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)'

    values = {
        'confirm_password': 'a',
        'city': 'msk',
        'tel_number': '9262100590',
        'password': 'a',
        'userrole': 'reklamodatel',
        'email': str(i) + '@qqe.cd'
    }

    headers = {'User-Agent': user_agent}

    data = urllib.urlencode(values)
    req = urllib2.Request(url, data, headers)
    response = urllib2.urlopen(req)
    the_page = response.read()
    print(the_page)

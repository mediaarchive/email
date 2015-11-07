import sys
import json
import quopri
import base64
import email
from imaplib import IMAP4_SSL
import base

config = json.load(open('config.json', 'r'))

try:
    print 'connecting'
    imap = IMAP4_SSL(config['api']['imap']['host'])
    print 'loggin in'
    imap.login(config['api']['imap']['user'], config['api']['imap']['pass'])
    print 'logged'
except imaplib.IMAP4.abort, e:
    print 'imap abort:', e
    sys.exit()
except imaplib.IMAP4.error, e:
    print "imap login failed:", e
    sys.exit(1)
else:
    print('imap connnected')

from email.Iterators import typed_subpart_iterator
def get_charset(message, default="ascii"):
    """Get the message charset"""

    if message.get_content_charset():
        return message.get_content_charset()

    if message.get_charset():
        return message.get_charset()

    return default

def get_body(message):
    """Get the body of the email message"""

    if message.is_multipart():
        #get the plain text version only
        text_parts = [part
                      for part in typed_subpart_iterator(message,
                                                         'text',
                                                         'plain')]
        body = []
        for part in text_parts:
            charset = get_charset(part, get_charset(message))
            body.append(unicode(part.get_payload(decode=True),
                                charset,
                                "replace"))

        return u"\n".join(body).strip()

    else: # if it is not multipart, the payload will be a string
          # representing the message body
        body = unicode(message.get_payload(decode=True),
                       get_charset(message),
                       "replace")
        return body.strip()

imap.select()
result, ids = imap.search(None, '(UNSEEN)')

for id in ids[0].split():
    mail = imap.fetch(id, '(BODY.PEEK[HEADER.FIELDS (SUBJECT)])')

    mail = email.mime.MIMEText(mail[1])
    print(mail)
    
    # subject = mail[1][0][1]
    # subject = subject.replace('Subject: ', '').replace('=?utf-8?b?', '').replace('?=', '').replace("\r\n", '')
    print get_body(mail), 1
    
    print subject
    print "\t" + base64.b64decode(subject).decode('utf-8')
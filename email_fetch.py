from imaplib import IMAP4_SSL
import email_parser
import imaplib
import config


def start():
    global config
    try:
        print('connecting')
        imap = IMAP4_SSL(config.main['api']['imap']['host'])
        print('loggin in')
        imap.login(config.main['api']['imap']['user'], config.main['api']['imap']['pass'])
        print('logged')
        
    except imaplib.IMAP4.abort as e:
        print('imap abort:', e)
        sys.exit()
        
    except imaplib.IMAP4.error as e:
        print("imap login failed:", e)
        sys.exit(1)
        
    else:
        print('imap connnected')
    
    imap.select()
    result, ids = imap.search(None, '(UNSEEN)')
    
    for id in ids[0].split():
        mail = imap.fetch(id, '(BODY.PEEK[HEADER.FIELDS (SUBJECT)])')
        subject = mail[1][0][1]
        
        print("\t" + id.decode() + ' ' + email_parser.subject_decode(subject))
        
        mail = imap.fetch(id, 'RFC822.TEXT')
        print(email_parser.content_parse(mail))
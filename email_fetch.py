from imaplib import IMAP4_SSL
import email
import email_parser
import imaplib

global config
def start():
    global config
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
    
    imap.select()
    result, ids = imap.search(None, '(UNSEEN)')
    
    for id in ids[0].split():
        mail = imap.fetch(id, '(BODY.PEEK[HEADER.FIELDS (SUBJECT)])')
        
        subject = mail[1][0][1]
        
        print "\t" + email_parser.subject_decode(subject)
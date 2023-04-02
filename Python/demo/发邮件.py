""""
参考：https://blog.csdn.net/weixin_62650212/article/details/123829431
"""
import ssl
# import requests
# import json
# from flask import jsonify
# from flask import Flask, request
# smtplib 用于邮件的发信动作
import smtplib
# email 用于构建邮件内容
from email.mime.text import MIMEText
# 构建邮件头
from email.header import Header
from email.message import EmailMessage
# import schedule
import time
from threading import Timer


def sms():
    # 这里我调用接口了，如果不调用 可以直接删除
    xg_url = ''
    # 无需安装第三方库
    key = 'lkgqysrfycnfbeae'  # 换成你的QQ邮箱SMTP的授权码(QQ邮箱设置里)
    EMAIL_ADDRESS = '583113636@qq.com'  # 换成你的邮箱地址
    EMAIL_PASSWORD = key
    smtp = smtplib.SMTP('smtp.qq.com', 25)
    context = ssl.create_default_context()
    sender = EMAIL_ADDRESS  # 发件邮箱
    receiver = ['583113636@qq.com']
    # 收件邮箱

    subject = "subject"
    # 这里我调用了自己的接口，如果不需要直接将body改为 body = '正文'
    # body = requests.get(xg_url).text
    body = 'body'
    msg = EmailMessage()
    msg['subject'] = subject  # 邮件主题
    msg['From'] = sender
    msg['To'] = receiver
    msg.set_content(body)  # 邮件内容

    with smtplib.SMTP_SSL("smtp.qq.com", 465, context=context) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)


if __name__ == '__main__':
    sms()




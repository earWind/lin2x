import requests as rq
from requests.cookies import RequestsCookieJar
import json
import ddddocr
import io
import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import ECB
import random

# 解决 print 乱码
# sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

key = 'ja72jks98x72masx'
gl_user_info = {}


def get_haixue_web():  # 获取登录页
    try:
        opt = Options()
        opt.add_experimental_option('excludeSwitches', ['enable-automation'])
        # 无头浏览器
        opt.add_argument('--headless')
        # 创建浏览器对象
        web = webdriver.Chrome(options=opt)
        url = "http://k2.haixue.com/user/login"
        web.get(url)
        # 获取cookie列表
        cookie_list = web.get_cookies()
        # 格式化打印cookie
        cookie_dict = {}
        for cookie in cookie_list:
            cookie_dict[cookie['name']] = cookie['value']
        return cookie_dict
    except:
        return 'error'


def get_captcha():  # 获取验证码
    try:
        r = rq.get('https://ucenter.haixue.com/common/captcha')
        if r.status_code == 200:
            cookie = rq.utils.dict_from_cookiejar(r.cookies)
            print(cookie)
            ocr = ddddocr.DdddOcr()
            print(ocr)
            captcha = ocr.classification(r.content)
            print(captcha)
            _cookie = {
                "__jsluid_h": cookie['__jsluid_s'],
                "captcha-uuid": cookie['captcha-uuid']
            }
            return [captcha, _cookie]

            # with open('D:\_git\lin2x\Python\demo\captcha.jpg', 'rb') as f:
            #     img_bytes = f.read()
            #     captcha = ocr.classification(img_bytes)
            #     print(captcha)
            # return captcha, {"__jsluid_h": cookie['__jsluid_s'],"captcha-uuid": cookie['captcha-uuid']}
    except:
        return 'error'


def login(user_name, pass_word):  # 登录
    web_cookie = get_haixue_web()
    if web_cookie == 'error':
        return 'get_haixue_web error'

    captcha_r = get_captcha()
    if captcha_r == 'error':
        return 'get_captcha error'

    captcha = captcha_r[0]
    captcha_cookie = captcha_r[1]

    user_name = ECB.aesEncrypt(key, user_name)
    pass_word = ECB.aesEncrypt(key, pass_word)
    data = {
        "userName": user_name,
        "passWord": pass_word,
        "systemCode": "crm",
        "verifyCode": captcha
    }

    # cookies
    """
      __jsluid_h=4c657609d153816dae21834715a76fe5;
      gr_user_id=ddbe222b-ba03-4f3b-9e6f-16e4673a6df4;
      afa6f4b5a41e143f_gr_session_id=52129f71-4e05-4cb1-a236-da6ddff707e8;
      afa6f4b5a41e143f_gr_session_id_52129f71-4e05-4cb1-a236-da6ddff707e8=true;
      captcha-uuid=0efecd68-1196-4c34-9e8a-a5e84a234afc
    """
    pre_cookie = dict(web_cookie, **captcha_cookie)
    cookies = rq.utils.cookiejar_from_dict(
        pre_cookie, cookiejar=None, overwrite=True
    )

    r = rq.request(
        method='POST',
        url='http://ucenter.haixue.com/sso-login',
        data=json.dumps(data),
        headers={
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,it;q=0.7',
            'Connection': 'keep-alive',
            'Content-Length': '116',
            'Content-Type': 'application/json; charset=utf-8',
            # 'Cookie': Cookie,
            'Host': 'ucenter.haixue.com',
            'Origin': 'http://k2.haixue.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        timeout=(5, 10),
        cookies=cookies,
    )

    if r.status_code == 200:
        # 保存用户信息
        global gl_user_info  # 声明是全局变量
        gl_user_info = json.loads(r.text)['data']

        # 合并cookie
        cookie = rq.utils.dict_from_cookiejar(r.cookies)
        next_cookie = dict(cookie, **pre_cookie)

        log_list = handle_login(next_cookie)
        return log_list
    else:
        return 'login error'


def handle_login(cookie):  # 处理登录成功后的逻辑
    list_data = get_chance_list(cookie)

    if isinstance(list_data, str):
        print(list_data)
        list_data = json.loads(list_data)

    totalNum = list_data['totalNum']
    totalPage = list_data['totalPage']

    # 获取机会列表，先判断最后一页有多少条，小于4的话就取倒数第二页
    if totalNum % totalPage < 4:
        list_data = get_chance_list(cookie, totalPage - 1)
    else:
        list_data = get_chance_list(cookie, totalPage)

    items = list_data['items']
    num = 0
    log_list = []
    for item in items:
        if not item['quotedMoney'] is None and num < 4:
            quote_temp = [1980, 2980, 3980, 4980, 5980]
            quote = random.choice(quote_temp)
            item['quote'] = quote
            msg = update_quote(cookie, item)
            num += 1
            log_list.append({'mobile': item['mobile'], 'msg': msg})
    return log_list


def get_chance_list(cookie, page='1'):  # 获取机会列表
    """
      :微信添加状态 是
      :报价金额 倒序
    """
    # f string 格式化字符串时，如果碰到大括号一定要用两个 {xx} => {{xxx}}
    value = f'{{"keywords":"","wxFriend":"1","sortName":"quotedMoney","sort":"DESC","currentPage":{page},"pageSize":20,"allGroupIds":[2705]}}'
    parm_secret_data = ECB.aesEncrypt(key, value)
    data = {
        # "parmSecretData": "YZ7KM3b19LbVmD0akpBC1rMnWmLS20rkcfZQ17EY0zEUJxry853T++lw#M3MKjk8kMtK0SrkyHSqMH2cYN#hvA=="
        "parmSecretData": parm_secret_data
    }

    # cookies
    """
      gr_user_id=486c33ca-2c07-4a0a-94e2-666d4db3ee1d;
      Hm_lvt_a2381ea68b047ac974f8d1977a0ef79e=1661671265;
      Hm_lvt_3801913c7c5b747b4e315c60418a9308=1661671265,1661699563; 
      zg_did=%7B%22did%22%3A%20%22183400bfc1d204-0b3e5c0466fe51-26021a51-1fa400-183400bfc1edf0%22%7D;
      zg_9b985b4e163746bcb3e8ae9a6789e00d=%7B%22sid%22%3A%201663226870817%2C%22updated%22%3A%201663226870821%2C%22info%22%3A%201663226870819%2C%22superProperty%22%3A%20%22%7B%5C%22%E5%BA%94%E7%94%A8%E5%90%8D%E7%A7%B0%5C%22%3A%20%5C%22%E5%BE%AE%E4%BF%A1%E5%AD%A6%E4%B9%A0%E5%8D%A1%5C%22%7D%22%2C%22platform%22%3A%20%22%7B%7D%22%2C%22utm%22%3A%20%22%7B%7D%22%2C%22referrerDomain%22%3A%20%22%22%2C%22cuid%22%3A%20%22undefined%22%7D;
      afa6f4b5a41e143f_gr_last_sent_cs1=CD15714; 
      x_access_token=eU28d1NezjlFemNIntoyeQrakZd5fKKwbk16as0tPF5ad6sdjlMrW6iD9+apjy3JfUiZQ23FHUEPVam81YjqhOlrlCuaDcOqUyoh+aW41AY=; 
      security_cookie_user=184562;
      afa6f4b5a41e143f_gr_session_id=00ec94d2-8596-40e9-bcc2-43f22474d0b3;
      afa6f4b5a41e143f_gr_last_sent_sid_with_cs1=00ec94d2-8596-40e9-bcc2-43f22474d0b3; 
      afa6f4b5a41e143f_gr_session_id_00ec94d2-8596-40e9-bcc2-43f22474d0b3=true; 
      x-access-token=0lT21yHv8G8776H+dWyBRB9iHzuZDQz72PPEkxTZFNwV0rMRXv6Cg1c2yOstwNsRsptgsykpcA5LX+57jOpv5CNpiUSLWCgEKhMG3UhsM2k=; 
      COOKIE_TICKET=NjQyYWY1NWQxMmI0MDQwMDA2OTkzNzBlLjE4NDU2Mi4xNjgwNTM2OTI1MTM0LjE2ODA1NTg1MjUxMzQuUEMuYTllNGVkY2M0NmRhMDIzZTIyNjBjYjE1MGJlZTUzOGE=;
      ul_ticket=NjQyYWY1NWQxMmI0MDQwMDA2OTkzNzBlLjE4NDU2Mi4xNjgwNTM2OTI1MTM0LjE2ODA1NTg1MjUxMzQuUEMuYTllNGVkY2M0NmRhMDIzZTIyNjBjYjE1MGJlZTUzOGE=;
      webapi_session_ticket=NjQyYWY1NWQxMmI0MDQwMDA2OTkzNzBlLjE4NDU2Mi4xNjgwNTM2OTI1MTM0LjE2ODA1NTg1MjUxMzQuUEMuYTllNGVkY2M0NmRhMDIzZTIyNjBjYjE1MGJlZTUzOGE=;
      webapi_session_ticket=NjQyYWY1NWQxMmI0MDQwMDA2OTkzNzBlLjE4NDU2Mi4xNjgwNTM2OTI1MTM0LjE2ODA1NTg1MjUxMzQuUEMuYTllNGVkY2M0NmRhMDIzZTIyNjBjYjE1MGJlZTUzOGE=;
      afa6f4b5a41e143f_gr_cs1=CD15714;
      SESSION=NGQ3NmMyZmQtNzc2Yi00NWFmLThiNGQtYTdkNWJhODRjZGJm
    """

    # Cookie = ''
    # jar = RequestsCookieJar()
    # for cookie in Cookie.split(';'):
    #     key, value = cookie.split('=', 1)
    #     jar.set(key, value)

    cookies = rq.utils.cookiejar_from_dict(
        cookie, cookiejar=None, overwrite=True
    )

    r = rq.request(
        method='POST',
        url='http://api-k2.haixue.com/wechat/headwork/chanceDetailList/list',
        data=json.dumps(data),
        headers={
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,it;q=0.7',
            'Connection': 'keep-alive',
            'Content-Length': '109',
            'Content-Type': 'application/json; charset=utf-8',
            # 'Cookie': Cookie,
            'Host': 'api-k2.haixue.com',
            'Origin': 'http://k2.haixue.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        cookies=cookies,
        timeout=(5, 10)
    )

    if r.status_code == 200:
        return json.loads(r.text)['data']


def update_quote(cookies, row):  # 修改报价
    id = row['assignId']
    wxChanceId = row['wxChanceId']
    quote = row['quote']
    value = f'{{"data":{{"id":{id},"wxChanceId":{wxChanceId},"quote":"{quote}"}},"updateFlowStatus":1}}'
    parm_secret_data = ECB.aesEncrypt(key, value)

    data = {
        # "parmSecretData": "YZ7KM3b19LbVmD0akpBC1rMnWmLS20rkcfZQ17EY0zEUJxry853T++lw#M3MKjk8kMtK0SrkyHSqMH2cYN#hvA=="
        "parmSecretData": parm_secret_data
    }

    r = rq.request(
        method='POST',
        url='http://api-k2.haixue.com/wechat/cloud/updateQuote',
        data=json.dumps(data),
        headers={
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,it;q=0.7',
            'Connection': 'keep-alive',
            'Content-Length': '149',
            'Content-Type': 'application/json; charset=utf-8',
            # 'Cookie': Cookie,
            'Host': 'api-k2.haixue.com',
            'Origin': 'http://k2.haixue.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        cookies=cookies,
        timeout=(5, 10)
    )

    if r.status_code == 200:
        mobile = row['mobile']
        before = row['quotedMoney']
        after = row['quote']
        ret = f'{mobile} change quote from {before} to {after}'
        return ret


if __name__ == '__main__':
    # login('CD15714', '@QP888888')
    # print(gl_user_info)
    print(get_haixue_web())

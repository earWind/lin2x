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

# python安装目录
print(sys.executable)

# 解决 print 乱码
# sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

aesEncryptKey = 'ja72jks98x72masx'
gl_user_info = {}


def get_haixue_web():  # 获取登录页
    try:
        opt = Options()
        opt.add_experimental_option('excludeSwitches', ['enable-automation'])
        # 无头浏览器
        opt.add_argument('--headless')

        # 创建浏览器对象
        web = webdriver.Chrome(options=opt)
        url = "https://k2.haixue.com/user/login"
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
            ocr = ddddocr.DdddOcr()
            captcha = ocr.classification(r.content)
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

    user_name = ECB.aesEncrypt(aesEncryptKey, user_name)
    pass_word = ECB.aesEncrypt(aesEncryptKey, pass_word)
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

    # session = rq.session()

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

        # print(gl_user_info)

        userInfo = gl_user_info['userInfo']
        default_cookies = {
            'security_cookie_user': str(userInfo['id']),
            'afa6f4b5a41e143f_gr_last_sent_cs1': userInfo['userName'],
            'afa6f4b5a41e143f_gr_cs1': userInfo['userName'],
        }
        login_cookies = get_headers_set_cookie(r)

        # 合并cookie
        # cookie = rq.utils.dict_from_cookiejar(session.cookies)
        current_cookies = dict(default_cookies, **pre_cookie)
        current_cookies.update(login_cookies)

        # useInfo_cookies = get_session_by_user_info(current_cookies)
        # current_cookies.update(useInfo_cookies)

        log_list = handle_login(current_cookies)
        return log_list
    else:
        return 'login error'


def get_headers_set_cookie(r):
    cookies = {}
    cookie_str = r.headers.get("Set-Cookie")
    cookie_tuple = cookie_str.split("; ")
    for item in cookie_tuple:
        cookie_key_value = item.replace(
            'HttpOnly,', '').replace('Path=/,', '').split("=")
        key = cookie_key_value[0].strip()

        if (key != 'Max-Age' and key != 'Expires' and key != 'Domain' and key != 'Path' and key != 'HttpOnly'):
            cookies[key] = cookie_key_value[1] + '='
    return cookies


def get_session_by_user_info(cookie):  # 获取用户信息
    cookies = rq.utils.cookiejar_from_dict(
        cookie, cookiejar=None, overwrite=True
    )

    """
      SESSION=MjU5ODU1OGUtNzIwNC00N2M3LTk4ZjMtMWQwYTAzNmU5ZjQz;
      gr_user_id=fafd0173-df98-459e-91ee-dd9094de163c;
      webapi_session_ticket=NjQ5ZmE0ZWQ4Mjk0YTUwMDA2ODdiNjdlLjE4NDU2Mi4xNjg4MTg0MDQ1NTU3LjE2ODgyMDU2NDU1NTcuUEMuMWI5NGRmYjhhNjY3ZGU2NTg3YzRkNGEzMDM4ZGIxOTA=;
      afa6f4b5a41e143f_gr_last_sent_cs1=CD15714;
      afa6f4b5a41e143f_gr_session_id=48cdb040-1ad4-452d-adf7-d852028e3aba;
      afa6f4b5a41e143f_gr_last_sent_sid_with_cs1=48cdb040-1ad4-452d-adf7-d852028e3aba;
      afa6f4b5a41e143f_gr_session_id_sent_vst=48cdb040-1ad4-452d-adf7-d852028e3aba;
      x-access-token=gv3WzetrTfC1NUVNWvM4yCF428zXRA6X72E3DfiY5YGZt4Q6b6xwSqNYdfyfOgpkTcTtU6YnwZ2zttNxZE4SsN+mkHWDhwofhncvQjvu6dg=;
      COOKIE_TICKET=NjQ5ZmI2NmExMmI0MDQwMDA2OTlkZDU3LjE4NDU2Mi4xNjg4MTg4NTIyNDgyLjE2ODgyMTAxMjI0ODIuUEMuMjZhZGYyNmY2Mjk0ZWFmYmE2ODM1N2RiZjAwNDY5ZGY=;
      ul_ticket=NjQ5ZmI2NmExMmI0MDQwMDA2OTlkZDU3LjE4NDU2Mi4xNjg4MTg4NTIyNDgyLjE2ODgyMTAxMjI0ODIuUEMuMjZhZGYyNmY2Mjk0ZWFmYmE2ODM1N2RiZjAwNDY5ZGY=;
      webapi_session_ticket=NjQ5ZmI2NmExMmI0MDQwMDA2OTlkZDU3LjE4NDU2Mi4xNjg4MTg4NTIyNDgyLjE2ODgyMTAxMjI0ODIuUEMuMjZhZGYyNmY2Mjk0ZWFmYmE2ODM1N2RiZjAwNDY5ZGY=;
      afa6f4b5a41e143f_gr_cs1=CD15714
    """

    r = rq.request(
        method='GET',
        url='http://api-doris-dwh.haixue.com/common/findBusDictionary',
        params={
            'names': 'chanceType,chanceSource,addWay,addWayDetail,addSource,addChannel,orderStatus,orderType,callStatus,callConnected'
        },
        headers={
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8,it;q=0.7',
            'Connection': 'keep-alive',
            # 'Cookie': Cookie,
            'Host': 'api-doris-dwh.haixue.com',
            'Origin': 'http://k2.haixue.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        },
        timeout=(5, 10),
        cookies=cookies,
    )

    print(json.loads(r.text))
    if r.status_code == 200:
        return get_headers_set_cookie(r)
    else:
        return {}


def handle_login(cookie):  # 处理登录成功后的逻辑
    list_data = get_chance_list(cookie)

    if list_data == False:
        return []

    total_num = list_data['totalNum']
    total_page = list_data['totalPage']

    # 获取机会列表，先判断最后一页有多少条，小于4的话就取倒数第二页
    if total_num % 20 < 4:
        list_data = get_chance_list(cookie, str(total_page - 1))
    else:
        list_data = get_chance_list(cookie, str(total_page))

    items = list_data['items']
    num = 0
    log_list = []
    for item in items:
        if item['quotedMoney'] is None and num < 5:
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
    parm_secret_data = ECB.aesEncrypt(aesEncryptKey, value)
    data = {
        # "parmSecretData": "YZ7KM3b19LbVmD0akpBC1rMnWmLS20rkcfZQ17EY0zEUJxry853T++lw#M3MKjk8kMtK0SrkyHSqMH2cYN#hvA=="
        "parmSecretData": parm_secret_data
    }

    # cookies
    """
      afa6f4b5a41e143f_gr_last_sent_cs1=CD15714;
      gr_user_id=e3c5df5a-01c4-4944-b4df-66f653cf6c5f;
        security_refresh=0d6e9e5bfce54702827ed4eafccc14b8.33923643.1688482171750.web.7641e960486b98492972887bf66117fa;
      afa6f4b5a41e143f_gr_session_id=cd45a2bf-58e1-45dc-9339-b4b48b74b3d6;
        afa6f4b5a41e143f_gr_last_sent_sid_with_cs1=cd45a2bf-58e1-45dc-9339-b4b48b74b3d6;
      afa6f4b5a41e143f_gr_session_id_sent_vst=cd45a2bf-58e1-45dc-9339-b4b48b74b3d6;
      security_cookie_user=184562;
        SESSION=MjdhMzA1YjktNDkxNi00MTE2LThjNTItNTRmZjQ3YWEzNDM2;
      x-access-token=oZS+bPDEdMC9J/88TZ5h7LYEOfd4eP2t6oI73m8TKY+QfL9P25sdRoFxLJ6QuWC5nMLalE+OZ2kYAVtfInbgMVfhmHYSzIMP/2IWX9GzC14=;
      COOKIE_TICKET=NjRiMjIwNTA4Mjk0YTUwMDA2ODgwMTAwLjE4NDU2Mi4xNjg5Mzk1MjgwOTA5LjE2ODk0MTY4ODA5MDkuUEMuNjJkMjdkZDk3MGZjOGMzOTMwZGYwNWM2M2I4YmIxOWY=;
      ul_ticket=NjRiMjIwNTA4Mjk0YTUwMDA2ODgwMTAwLjE4NDU2Mi4xNjg5Mzk1MjgwOTA5LjE2ODk0MTY4ODA5MDkuUEMuNjJkMjdkZDk3MGZjOGMzOTMwZGYwNWM2M2I4YmIxOWY=;
      webapi_session_ticket=NjRiMjIwNTA4Mjk0YTUwMDA2ODgwMTAwLjE4NDU2Mi4xNjg5Mzk1MjgwOTA5LjE2ODk0MTY4ODA5MDkuUEMuNjJkMjdkZDk3MGZjOGMzOTMwZGYwNWM2M2I4YmIxOWY=;
      afa6f4b5a41e143f_gr_cs1=CD15714;
      webapi_session_ticket=NjRiMjIwNTA4Mjk0YTUwMDA2ODgwMTAwLjE4NDU2Mi4xNjg5Mzk1MjgwOTA5LjE2ODk0MTY4ODA5MDkuUEMuNjJkMjdkZDk3MGZjOGMzOTMwZGYwNWM2M2I4YmIxOWY=
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
        res = json.loads(r.text)
        code = res['code']
        data = res['data']

        # print(res, data)

        # if isinstance(data, str):
        #     return json.loads(data)
        if code == 200:
            return data
        else:
            return False


def update_quote(cookies, row):  # 修改报价
    id = row['assignId']
    wxChanceId = row['wxChanceId']
    quote = row['quote']
    value = f'{{"data":{{"id":{id},"wxChanceId":{wxChanceId},"quote":"{quote}"}},"updateFlowStatus":1}}'
    parm_secret_data = ECB.aesEncrypt(aesEncryptKey, value)

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
    r = login('CD15714', '@qp88888888')
    print(r)
    # print(gl_user_info)
    # print(get_haixue_web())

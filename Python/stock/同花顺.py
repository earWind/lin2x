import datetime
from chinese_calendar import is_workday, is_holiday
import pandas as pd
import wencai
import io
import sys
import json

# 解决 print 乱码
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 获取范围内所有日期
# e = pd.bdate_range('8/7/2019', '8/31/2019')
# days = e.date  # 获取日期列表
# print(days)

# 获取今天日期
# a = datetime.datetime.today()
# b = is_holiday(a)
# c = is_workday(a)
# print(a, b, c)

# 获取开始-结束时间内的工作日
# get_workday_list('2023-01-01', '2023-01-31')


def get_workday_list(startTime, endTime):

    date_list = []
    date_range = pd.bdate_range(startTime, endTime)

    for d in date_range:
        if (is_workday(d)):
            # 日期叠加一天
            # datestart+=datetime.timedelta(d=+1)
            str_d = d.strftime('%Y-%m-%d')
            date_list.append(str_d)

    return date_list


def get_wencai():
    data_pd = wencai.get(question='市值大于100亿,2023年2月涨幅大于30%,非新股与次新股,非科创板')

    # print(list(data_pd))
    # code 最新价 区间涨跌幅:前复权[20230201-20230228] 股票代码 股票简称
    stock_list = []

    # data_pd.to_csv("test12.csv", index=False, sep='\n')

    # for row_id in range(data_pd.shape[0]):
    #     print(data_pd.iloc[row_id])

    for index, row in data_pd.iterrows():
        stock = {}
        stock['code'] = row['code']
        stock['name'] = row['股票简称']
        stock['price'] = row['最新价']

        for key in list(data_pd):
            if key.startswith('区间涨跌幅'):
                stock['increase'] = row[key]

        stock_list.append(stock)
    print(stock_list)
    codes = []
    for stock in stock_list:
        codes.append(stock['code'])
    get_next_month_increase(codes)


def get_next_month_increase(code):
    question = '{code},2023年3月涨幅'.format(code=','.join(code))
    data_pd = wencai.get(question=question)
    # json.dumps(data_pd)
    # json.dump(data_pd, open(
    #     'D:\_git\lin2x\Python\stock\stockfile.json', 'w'), indent=4)

    next_list = []
    for index, row in data_pd.iterrows():
        stock = {}
        stock['code'] = row['股票代码']
        stock['name'] = row['股票简称']
        stock['price'] = row['最新价']
        for key in row.keys():
            if key.startswith('区间涨跌幅'):
                stock['increase'] = row[key]

        next_list.append(stock)
    print(next_list)


if __name__ == '__main__':
    # work_day_list = get_workday_list('2023-01-01', '2023-01-31')
    # print(work_day_list)

    get_wencai()

    # get_next_month_increase('300114,600705')

import datetime

flats_checks = list()

flats_checks.append([{'check_at': datetime.datetime(2019, 12, 11, 12, 3, 43, 30000), 'status': 'reserve', 'price': 3421440}, {'check_at': datetime.datetime(2019, 12, 12, 0, 3, 2, 915000), 'status': 'reserve', 'price': 3421440}, {'check_at': datetime.datetime(2019, 12, 13, 8, 32, 32, 104000), 'status': 'reserve', 'price': 3425400}])
flats_checks.append([{'check_at': datetime.datetime(2019, 12, 11, 12, 3, 43, 70000), 'status': 'free', 'price': 4331520}, {'check_at': datetime.datetime(2019, 12, 13, 8, 32, 33, 23000), 'status': 'free', 'price': 4317120}])
flats_checks.append([{'check_at': datetime.datetime(2019, 12, 11, 12, 3, 43, 160000), 'status': 'free', 'price': 4054680}, {'check_at': datetime.datetime(2019, 12, 12, 0, 3, 2, 968000), 'status': 'free', 'price': 4054680}, {'check_at': datetime.datetime(2019, 12, 13, 8, 32, 35, 390000), 'status': 'free', 'price': 4054680}])
flats_checks.append([{'check_at': datetime.datetime(2019, 12, 12, 0, 3, 3, 36000), 'status': 'free', 'price': 3977100}, {'check_at': datetime.datetime(2019, 12, 13, 8, 32, 39, 226000), 'status': 'free', 'price': 3977100}])


prices = dict()

for check in flats_checks:
    for c in check:
        date = c['check_at'].date()
        prices.setdefault(date, list())
        prices[date].append(c['price'])

print(prices)
for p in prices:
    prices[p] = sum(prices[p])/len(prices[p])
print(prices)
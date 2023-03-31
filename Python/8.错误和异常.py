# while True:
#     try:
#         raise NameError('HiThere')
#     except ValueError:
#         print("Oops!  That was no valid number.  Try again...")


try:
    raise KeyboardInterrupt
finally:
    print('Goodbye, world!')

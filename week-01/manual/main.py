marks =input().split(",")
valid_marks = []
for mark in marks:
    try:
        mark = float(mark)
        if 0<= mark <= 100:
            valid_marks.append(mark)

    except ValueError:
        continue

if len(valid_marks)==0:
    print("no valid marks")
else:
    valid_marks_num = len(valid_marks)
    average=sum(valid_marks)/ valid_marks_num
    highest=max(valid_marks)
    lowest=min(valid_marks)

    passed=0
    for mark in valid_marks:
        if mark >=50:
            passed+=1
    pass_rate=(passed/valid_marks_num)*100
    print("Valid: ", valid_marks_num)
    print("Average: ",average)
    print("Highest: ",highest)
    print("lowest: ",lowest)
    print("Pass rate: ",pass_rate,"%")
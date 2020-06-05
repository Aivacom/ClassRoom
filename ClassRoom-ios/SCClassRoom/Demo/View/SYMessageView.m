//
//  SYMessageView.m
//  SCClassRoom
//
//  Created by GasparChu on 2020/3/6.
//  Copyright © 2020 SY. All rights reserved.
//

#import "SYMessageView.h"
#import "SYMessageCell.h"
#import "NSBundle+SYLanguage.h"
#import "SYMessageTxtModel.h"
#import "MBProgressHUD+SYHUD.h"

static NSString *const SYMessageCellKey = @"SYMessageCellKey";


@interface SYMessageView ()<UITableViewDataSource, UITableViewDelegate>

@property (nonatomic, copy) NSString *userId;               // 自己的 id
@property (nonatomic, copy) NSString *teacherId;            // 老师的 id
@property (nonatomic, strong) UITableView *tableView;
@property (nonatomic, strong) UIButton *switchBtn;          // 切换数据源按钮
@property (nonatomic, strong) UIButton *chatBtn;            // 聊天按钮
@property (nonatomic, strong) NSMutableArray *allMsgMArr;   // 所有发言数据
@property (nonatomic, strong) NSMutableArray *teaMsgMArr;   // 老师发言数据
@property (nonatomic, strong) UIView *lineView;                 // 分割线

@end

@implementation SYMessageView

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setup];
    }
    return self;
}

- (void)setup
{
    [self addSubview:self.tableView];
    [self addSubview:self.switchBtn];
    [self addSubview:self.chatBtn];
    [self addSubview:self.lineView];
    
    [self setupLayout];
}

- (void)setupLayout
{
    [self.tableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.right.mas_offset(0.f);
        make.bottom.mas_equalTo(self.chatBtn.mas_top);
    }];
    [self.switchBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_offset(9.f);
        make.bottom.mas_offset(-10.f);
        make.size.mas_offset(40.f);
    }];
    [self.chatBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.switchBtn.mas_right).mas_offset(9.f);
        make.right.mas_offset(-11.f);
        make.centerY.mas_equalTo(self.switchBtn);
        make.height.mas_offset(40.f);
    }];
    [self.lineView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.top.bottom.mas_offset(0.f);
        make.width.mas_offset(0.5f);
    }];
    
    [self setChatbtnStatus:NO];
}

#pragma mark - Event
- (void)setUserId:(NSString *)userId teacherId:(NSString *)teacherId
{
    self.userId = userId;
    self.teacherId = teacherId;
}

- (void)switchBtnClicked:(UIButton *)sender
{
    if (sender.isSelected) {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"看全员发言"]];
    } else {
        [MBProgressHUD jly_showToast:[NSBundle yy_localizedStringWithKey:@"只看老师发言"]];
    }
    sender.selected = !sender.selected;
    [self reloadTableView];
}

- (void)chatBtnClicked:(UIButton *)sender
{
    if ([self.delegate respondsToSelector:@selector(chatBeiginEditing)]) {
        [self.delegate chatBeiginEditing];
    }
}

- (void)setChatbtnStatus:(BOOL)isEnable
{
    self.chatBtn.enabled = isEnable;
    if (isEnable) {
        [self.chatBtn setTitle:[NSBundle yy_localizedStringWithKey:@"请输入文字..."] forState:UIControlStateNormal];
    } else {
        [self.chatBtn setTitle:[NSBundle yy_localizedStringWithKey:@"禁言中"] forState:UIControlStateNormal];
    }
}

- (void)didReceiveMessage:(SYMessageTxtModel *)model
{
    [self.allMsgMArr addObject:model];
    // 如果发送者是老师，加入到老师发言数组中
    if ([model.sendUserId isEqualToString:self.teacherId]) {
        [self.teaMsgMArr addObject:model];
    }
    [self reloadTableView];
}

- (void)reloadTableView
{
    // 刷新列表
    [self.tableView reloadData];
    // 滑动列表到底部
    if (self.switchBtn.isSelected) {
        !self.teaMsgMArr.count?:[self.tableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.teaMsgMArr.count - 1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:NO];
    } else {
        !self.allMsgMArr.count?:[self.tableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.allMsgMArr.count - 1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:NO];
    }
}

#pragma mark - UITableViewDataSource & UITableViewDelegate
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return self.switchBtn.selected ? self.teaMsgMArr.count : self.allMsgMArr.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    SYMessageCell *cell = [tableView dequeueReusableCellWithIdentifier:SYMessageCellKey forIndexPath:indexPath];
    if (self.switchBtn.isSelected) {
        [cell setDataWithUserId:self.userId teacherId:self.teacherId txtModel: self.teaMsgMArr[indexPath.row]];
    } else {
        [cell setDataWithUserId:self.userId teacherId:self.teacherId txtModel: self.allMsgMArr[indexPath.row]];
    }
    return cell;
}

#pragma mark - Getter & Setter
- (UITableView *)tableView
{
    if (!_tableView) {
        UITableView *view = [[UITableView alloc] initWithFrame:CGRectZero style:(UITableViewStylePlain)];
        view.delegate = self;
        view.dataSource =self;
        view.separatorStyle = UITableViewCellSeparatorStyleNone;
        view.estimatedRowHeight = 60.f;
        [view registerClass:[SYMessageCell class] forCellReuseIdentifier:SYMessageCellKey];
        _tableView = view;
    }
    return _tableView;
}

- (UIButton *)switchBtn
{
    if (!_switchBtn) {
        UIButton *btn = [UIButton new];
        [btn setImage:[UIImage imageNamed:@"live_chat_all"] forState:UIControlStateSelected];
        [btn setImage:[UIImage imageNamed:@"live_chat_teacher"] forState:UIControlStateNormal];
        [btn addTarget:self action:@selector(switchBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _switchBtn = btn;
    }
    return _switchBtn;
}

- (UIButton *)chatBtn
{
    if (!_chatBtn) {
        UIButton *btn = [UIButton new];
        btn.backgroundColor = [UIColor colorWithRed:245/255.0 green:245/255.0 blue:245/255.0 alpha:1.0];
        btn.titleLabel.font = [UIFont systemFontOfSize:13.f];
        [btn setTitleColor:[UIColor colorWithRed:153/255.0 green:153/255.0 blue:153/255.0 alpha:1.0] forState:UIControlStateNormal];
        [btn setTitle:[NSBundle yy_localizedStringWithKey:@"请输入文字..."] forState:UIControlStateNormal];
        btn.layer.cornerRadius = 8.f;
        [btn addTarget:self action:@selector(chatBtnClicked:) forControlEvents:UIControlEventTouchUpInside];
        _chatBtn = btn;
    }
    return _chatBtn;
}


- (NSMutableArray *)allMsgMArr
{
    if (!_allMsgMArr) {
        NSMutableArray *mArr = [NSMutableArray array];
        _allMsgMArr = mArr;
    }
    return _allMsgMArr;
}

- (NSMutableArray *)teaMsgMArr
{
    if (!_teaMsgMArr) {
        NSMutableArray *mArr = [NSMutableArray array];
        _teaMsgMArr = mArr;
    }
    return _teaMsgMArr;
}

- (UIView *)lineView
{
    if (!_lineView) {
        UIView *view = [UIView new];
        view.backgroundColor = [UIColor colorWithRed:235/255.0 green:235/255.0 blue:235/255.0 alpha:1.0];
        _lineView = view;
    }
    return _lineView;
}

@end

import fs from 'fs';
import omggif from 'omggif';
import THREE from 'three';    
import SoftwareRenderer from 'three-software-renderer';

let testData = {
  "sources": [
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf2_zEfgJO7c6xkc6KxvSmMe_UkG5UvMZw3O-Qp9Tw3AXgrURqZWChJIGWdwdqMg6Erwfv366x0n0TDkh_/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf1fzBfQJO7c6xkc7TlK-gZrrXwG8JvpNy2rzA9omn2Aft_0duYGv2cdfEJ1A9NwnYq1Xq366x0iPpWjMW/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYvb-8Lzho3P_HTjFD_tuz2oOIka-mMuyElTkAuZNwjOvD99Wm3lDj8xY4am2icYHHcgVqNwmD-FGggbC43D5opgw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbaqPgM57PXHeDF94N2kk4XFlq_yZOmBwm4CucYl0rqQ8NrxiQDs8xU6YzjwcYOTcw45aV_S_Vm3yfCv28FpJOqn7Q/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbaqPgM57PvHfTJ94N2kk4XFkqP2Z-jXl24D6p0n3bmRrN322VbmqUo5Nj2iINXDcVBtN13Y8gK6l_Cv28Fpru2Faw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09S5mI-0m_bmNL6fwm5XsZwmi-yV946m0QKy80JlYDr1J4XAdAQ_NVDS_Vntl7rm0cXo7YOJlyW-Yc6xpw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYsLasOxRp16D3dzJL4OO6lZKMkrmhNb7XwjNVvcEi2-qZodmm31bhrkpoNWj2LIXEdAA8N1-ErFO8x7y-m9bi69aviGNL/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09S5mI-0m_bmNL6fwm5XsZwmi-yV946m0QKy80JlYDr1J4XAdAQ_NVDS_Vntl7rm0cXo7YOJlyW-Yc6xpw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYs6mpFAZf1fzBfQJO7c6xkc6Nx6L3YLmGxjwBv8F3j-zDp96l2lGy_hBkYGr1cIHEI1BoNF-ErFi3366x0vx2md6N/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbaqPgM57PXHeDF94N2kk4XFlq_yZOmBwm4CucYl0rqQ8NrxiQDs8xU6YzjwcYOTcw45aV_S_Vm3yfCv28FpJOqn7Q/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09S5mI-0m_bmNL6fwm5XsZwmi-yV946m0QKy80JlYDr1J4XAdAQ_NVDS_Vntl7rm0cXo7YOJlyW-Yc6xpw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f2_zEfgJO7c6xkc6Kx6f1N-yEzm8EucMj2LyYpt6h3lHn_kc6YGzyINWTdFJoYguBrwe_366x0j6nZw_B/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f2_zEfgJO7c6xkc6Kx6f1N-yEzm8EucMj2LyYpt6h3lHn_kc6YGzyINWTdFJoYguBrwe_366x0j6nZw_B/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYoLW9Lgpp3fzaTjVN4NOJmIGZkPK6ZeKEkzMD6pwm2-iT8NX3jQ2yr0o5ZW_1LNeTdVBtNQ6C-wO4wO65g4j84spzYhycOw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYvb-8Lzhm3PrETjFD_tuz2oPZz_GkMumEkDsDvcQij7nApt3wiQyy8xI9aj2nJoXGdVNoYluGqAKggbC4nBDM0V0/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf2_zEfgJO7c6xkc6KxvSmMe_UkG5UvMZw3O-Qp9Tw3AXgrURqZWChJIGWdwdqMg6Erwfv366x0n0TDkh_/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f2_zEfgJO7c6xkc6Kx6f1N-yEzm8EucMj2LyYpt6h3lHn_kc6YGzyINWTdFJoYguBrwe_366x0j6nZw_B/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf2_zEfgJO7c6xkc6KxvSmMe_UkG5UvMZw3O-Qp9Tw3AXgrURqZWChJIGWdwdqMg6Erwfv366x0n0TDkh_/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYvb-8Lzho3P_HTjFD_tuz2oOIka-mMuyElTkAuZNwjOvD99Wm3lDj8xY4am2icYHHcgVqNwmD-FGggbC43D5opgw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09q5nYy0m_bmNL6flWhXu51zjruZp92m31fk_UU6MDymLYbGcwFvaViGrgPryLi5g8Lv6oOJlyWw1RQ22w/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbaqPgM57PXHeDF94N2kk4XFlq_yZOmBwm4CucYl0rqQ8NrxiQDs8xU6YzjwcYOTcw45aV_S_Vm3yfCv28FpJOqn7Q/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf1fzBfQJO7c6xkc7TlK-gZrrXwG8JvpNy2rzA9omn2Aft_0duYGv2cdfEJ1A9NwnYq1Xq366x0iPpWjMW/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09S5mI-0m_bmNL6fwm5XsZwmi-yV946m0QKy80JlYDr1J4XAdAQ_NVDS_Vntl7rm0cXo7YOJlyW-Yc6xpw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09q5nYy0m_bmNL6flWhXu51zjruZp92m31fk_UU6MDymLYbGcwFvaViGrgPryLi5g8Lv6oOJlyWw1RQ22w/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf2_zEfgJO7c6xkc6KxvSmMe_UkG5UvMZw3O-Qp9Tw3AXgrURqZWChJIGWdwdqMg6Erwfv366x0n0TDkh_/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f2_zEfgJO7c6xkc6Kx6f1N-yEzm8EucMj2LyYpt6h3lHn_kc6YGzyINWTdFJoYguBrwe_366x0j6nZw_B/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09S5mI-0m_bmNL6fwm5XsZwmi-yV946m0QKy80JlYDr1J4XAdAQ_NVDS_Vntl7rm0cXo7YOJlyW-Yc6xpw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYoLW9Lgpp3fzaTjVN4NOJmIGZkPK6ZeKEkzMD6pwm2-iT8NX3jQ2yr0o5ZW_1LNeTdVBtNQ6C-wO4wO65g4j84spzYhycOw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09S5mI-0m_bmNL6fwm5XsZwmi-yV946m0QKy80JlYDr1J4XAdAQ_NVDS_Vntl7rm0cXo7YOJlyW-Yc6xpw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf1fzBfQJO7c6xkc7TlK-gZrrXwG8JvpNy2rzA9omn2Aft_0duYGv2cdfEJ1A9NwnYq1Xq366x0iPpWjMW/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf2_zEfgJO7c6xkc6KxvSmMe_UkG5UvMZw3O-Qp9Tw3AXgrURqZWChJIGWdwdqMg6Erwfv366x0n0TDkh_/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYur2nFA9v3_z3fTxQ69n4wdHcwfLxNr-HxD8H651w3ezEodut31WxrUZlajynLI6cewRoYQ2F_0_-n7nTIrfFUQ/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYur2nFAFv2v_3fTxQ69n4x9fZkvSiMb-HxGkC6pQl37rE9Nqj3ALh-ENtN27yI9CUegE3MgrUq0_-n7mmJ4g0OA/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09q5nYy0m_bmNL6flWhXu51zjruZp92m31fk_UU6MDymLYbGcwFvaViGrgPryLi5g8Lv6oOJlyWw1RQ22w/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYsLasOxRp16D3eTJO4-O6lZKMkrmja-6Fw2oG6cQni7CT942n3wPt_0c5YTvwd9eScQ43N1nR-wTtwOzom9bi61pgNcKR/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f1fzBfQJO7c6xkc7bxvOjNe6DkzkGvZ0nj-rD8Y2sjFHjrkc_Nzr0JdWddAQ_MFHR81e_366x0rOxUMwD/80fx80f",
      "color": "#D32CE6"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f2_zEfgJO7c6xkc6Kx6f1N-yEzm8EucMj2LyYpt6h3lHn_kc6YGzyINWTdFJoYguBrwe_366x0j6nZw_B/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f2_zEfgJO7c6xkc6Kx6f1N-yEzm8EucMj2LyYpt6h3lHn_kc6YGzyINWTdFJoYguBrwe_366x0j6nZw_B/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf2_zEfgJO7c6xkc6KxvSmMe_UkG5UvMZw3O-Qp9Tw3AXgrURqZWChJIGWdwdqMg6Erwfv366x0n0TDkh_/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYur2nFA9v3_z3fTxQ69n4wdHcwfLxNr-HxD8H651w3ezEodut31WxrUZlajynLI6cewRoYQ2F_0_-n7nTIrfFUQ/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf2_zEfgJO7c6xkc6KxvSmMe_UkG5UvMZw3O-Qp9Tw3AXgrURqZWChJIGWdwdqMg6Erwfv366x0n0TDkh_/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYvb-8Lzho3P_HTjFD_tuz2oOIka-mMuyElTkAuZNwjOvD99Wm3lDj8xY4am2icYHHcgVqNwmD-FGggbC43D5opgw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f2_zEfgJO7c6xkc6Kx6f1N-yEzm8EucMj2LyYpt6h3lHn_kc6YGzyINWTdFJoYguBrwe_366x0j6nZw_B/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYsLasOxRp16D3eTJO4-O6lZKMkrmja-6Fw2oG6cQni7CT942n3wPt_0c5YTvwd9eScQ43N1nR-wTtwOzom9bi61pgNcKR/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYorOxKglf2_zEfgJO7c6xkc6KxvSmMe_UkG5UvMZw3O-Qp9Tw3AXgrURqZWChJIGWdwdqMg6Erwfv366x0n0TDkh_/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09S5mI-0m_bmNL6fwm5XsZwmi-yV946m0QKy80JlYDr1J4XAdAQ_NVDS_Vntl7rm0cXo7YOJlyW-Yc6xpw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYvb-8Lzho3P_HTjFD_tuz2oOIka-mMuyElTkAuZNwjOvD99Wm3lDj8xY4am2icYHHcgVqNwmD-FGggbC43D5opgw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbaqPgM57PvHfTJ94N2kk4XFkqP2Z-jXl24D6p0n3bmRrN322VbmqUo5Nj2iINXDcVBtN13Y8gK6l_Cv28Fpru2Faw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEYtbWwJRNlwf_HdjRB09S5mI-0m_bmNL6fwm5XsZwmi-yV946m0QKy80JlYDr1J4XAdAQ_NVDS_Vntl7rm0cXo7YOJlyW-Yc6xpw/80fx80f",
      "color": "#8847FF"
    },
    {
      "src": "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXQ9QVcJY8gulRYX0DbRvCiwMbQVg8kdFEY5b6oKh9f1fzBfQJO7c6xkc7bxvOjNe6DkzkGvZ0nj-rD8Y2sjFHjrkc_Nzr0JdWddAQ_MFHR81e_366x0rOxUMwD/80fx80f",
      "color": "#D32CE6"
    }
  ],
  "width": 10,
  "height": 5,
  "imageWidth": 64,
  "imageHeight": 64,
  "backgroundColor": "#cccccc",
  "textStyle": 0
};

// How many frames and how large shall the GIF be?
let NUM_FRAMES = 5, WIDTH = 320, HEIGHT = 192;

// Our scene, camera and renderer and a box to render
let scene    = new THREE.Scene(),
    cam      = new THREE.OrthographicCamera(0, 0, 0, 0, 0, 50),
    renderer = new SoftwareRenderer();

renderer.setSize(WIDTH, HEIGHT);

var box = new THREE.Mesh(
  new THREE.BoxGeometry(30, 30, 30),
  new THREE.MeshBasicMaterial({color: 0xff0000})
);

scene.add(box);

// GIF has a color palette of 256 possible colours, we're fixing them to two.
// TODO: Generate the palette automatically from the scene
var palette = [0x000000, 0xff0000];

var gifBuffer = new Buffer(WIDTH * HEIGHT * NUM_FRAMES); // holds the entire GIF output
var gif = new omggif.GifWriter(gifBuffer, WIDTH, HEIGHT, {palette: palette, loop: 0});

for(var frame=0; frame<NUM_FRAMES; frame++) {
  box.rotation.y += Math.PI / 100;

  var pixels = renderer.render(scene, cam); // render a frame in memory
  // for each frame of the GIF we'll have to convert the RGBA pixels into palette indices
  gif.addFrame(0, 0, pixels.width, pixels.height, convertRGBAto8bit(pixels.data, palette));
}
fs.writeFileSync('../public/temp/test.gif', gifBuffer.slice(0, gif.end()));

function convertRGBAto8bit(rgbaBuffer, palette) {
  var outputBuffer = new Uint8Array(rgbaBuffer.length / 4);

  for(var i=0; i<rgbaBuffer.length; i+=4) {
    var colour = (rgbaBuffer[i] << 16) + (rgbaBuffer[i+1] << 8) + rgbaBuffer[i+2];
    for(var p=0; p<palette.length; p++) {
      if(colour == palette[p]) {
        outputBuffer[i/4] = p;
        break;
      }
    }
  }

  return outputBuffer;
}